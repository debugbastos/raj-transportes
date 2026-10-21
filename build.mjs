// Build da landing page (React + TypeScript) com esbuild.
//   node build.mjs            -> build de produção em dist/
//   node build.mjs --serve    -> servidor de desenvolvimento com rebuild automático
//   node build.mjs --preview  -> serve a pasta dist/ já compilada
//   node build.mjs --single   -> build + dist-single/index.html autônomo (tudo embutido)
import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir, rm, cp, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const serve = args.has("--serve");
const preview = args.has("--preview");
const single = args.has("--single");
const outdir = "dist";
const port = 5173;

const buildOptions = {
  entryPoints: { main: "src/main.tsx" },
  bundle: true,
  outdir: `${outdir}/assets`,
  format: "esm",
  target: ["es2020"],
  jsx: "automatic",
  minify: !serve,
  sourcemap: serve,
  metafile: true,
  entryNames: serve ? "[name]" : "[name]-[hash]",
  assetNames: "[name]-[hash]",
  publicPath: "./assets",
  loader: { ".jpg": "file", ".png": "file", ".svg": "file", ".woff2": "file" },
  define: { "process.env.NODE_ENV": JSON.stringify(serve ? "development" : "production") },
  logLevel: "info",
};

async function writeHtml(metafile) {
  const outputs = Object.keys(metafile.outputs);
  const js = outputs.find((f) => /assets\/main(-[A-Z0-9]+)?\.js$/i.test(f));
  const css = outputs.find((f) => /assets\/main(-[A-Z0-9]+)?\.css$/i.test(f));
  let html = await readFile("index.html", "utf8");
  html = html.replace(
    '<script type="module" src="./src/main.tsx"></script>',
    `<script type="module" src="./${path.relative(outdir, js)}"></script>`,
  );
  html = html.replace(
    "<!-- build:css -->",
    css ? `<link rel="stylesheet" href="./${path.relative(outdir, css)}" />` : "",
  );
  await writeFile(`${outdir}/index.html`, html);
  return { js, css, html };
}

const htmlPlugin = {
  name: "html",
  setup(build) {
    build.onEnd(async (result) => {
      if (result.errors.length || !result.metafile) return;
      await writeHtml(result.metafile);
    });
  },
};

async function copyPublic() {
  if (existsSync("public")) await cp("public", outdir, { recursive: true });
}

async function makeSingle({ js, css, html }) {
  // Versão autônoma: CSS, JS e imagens embutidos em um único index.html.
  const mime = { ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
  const assets = await readdir(`${outdir}/assets`);
  const dataUri = {};
  for (const f of assets) {
    const ext = path.extname(f);
    if (!mime[ext]) continue;
    const b64 = (await readFile(`${outdir}/assets/${f}`)).toString("base64");
    dataUri[`./assets/${f}`] = `data:${mime[ext]};base64,${b64}`;
  }
  const embed = (text) => Object.entries(dataUri).reduce((t, [k, v]) => t.split(k).join(v), text);
  let jsText = embed(await readFile(js, "utf8"));
  let cssText = css ? embed(await readFile(css, "utf8")) : "";
  const fav = (await readFile(`${outdir}/favicon.png`)).toString("base64");
  let out = html
    .replace(/<link rel="stylesheet" href="\.\/assets\/[^"]+" \/>/, `<style>${cssText}</style>`)
    .replace(/<script type="module" src="\.\/assets\/[^"]+"><\/script>/, () => `<script type="module">${jsText.replace(/<\/script/gi, "<\\/script")}</script>`)
    .replace('href="./favicon.png"', `href="data:image/png;base64,${fav}"`);
  await mkdir("dist-single", { recursive: true });
  await writeFile("dist-single/index.html", out);
  console.log(`dist-single/index.html (${Math.round(out.length / 1024)} KB)`);
}

if (preview) {
  const ctx = await esbuild.context({ entryPoints: [], write: false });
  const { port: p } = await ctx.serve({ servedir: outdir, port });
  console.log(`Prévia em http://localhost:${p}`);
} else if (serve) {
  await rm(outdir, { recursive: true, force: true });
  await mkdir(outdir, { recursive: true });
  await copyPublic();
  const ctx = await esbuild.context({ ...buildOptions, plugins: [htmlPlugin] });
  await ctx.watch();
  const { port: p } = await ctx.serve({ servedir: outdir, port });
  console.log(`Servidor de desenvolvimento em http://localhost:${p}`);
} else {
  await rm(outdir, { recursive: true, force: true });
  await mkdir(outdir, { recursive: true });
  const result = await esbuild.build(buildOptions);
  await copyPublic();
  const files = await writeHtml(result.metafile);
  console.log("Build concluído em dist/");
  if (single) await makeSingle(files);
}
