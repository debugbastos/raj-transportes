import { useMemo, useState } from "react";
import { LuArrowRight, LuZoomIn } from "react-icons/lu";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { useGallery } from "../components/Lightbox";
import { PHOTOS } from "../config/company";
import { scrollToId } from "../lib/scroll";
import type { PhotoCategory } from "../types";
import "./fleet.css";

const FILTERS: { key: "all" | PhotoCategory; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "van", label: "Vans" },
  { key: "caminhao", label: "Caminhões-baú" },
  { key: "carga", label: "Carga" },
];

export function Fleet() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const openGallery = useGallery();
  const visible = useMemo(
    () => PHOTOS.map((p, i) => ({ p, i })).filter(({ p }) => filter === "all" || p.cat === filter),
    [filter],
  );
  const ids = visible.map((v) => v.i);
  const mosaic = filter === "all";

  return (
    <section className="section fleet" id="frota" aria-labelledby="frota-title">
      <div className="container">
        <div className="fleet__head">
          <SectionHeading id="frota-title" eyebrow="Nossa frota" lead="Veículos preparados para" strong="diferentes necessidades.">
            Conheça as opções de transporte da RAJ Transportes. Toque em uma foto para ampliar.
          </SectionHeading>
          <Reveal className="filters" delay={160}>
            <div role="group" aria-label="Filtrar fotos da frota" className="filters__group">
              {FILTERS.map((f) => (
                <button key={f.key} type="button" className="filter" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div
          className={`fleet__grid ${mosaic ? "fleet__grid--mosaic" : "fleet__grid--flat"}`}
          style={{ ["--n" as string]: Math.min(visible.length, 4), ["--m" as string]: Math.min(visible.length, 2) }}
          key={filter}
        >
          {visible.map(({ p, i }, k) => (
            <button
              key={p.src}
              type="button"
              className={`tile${mosaic ? ` tile--${p.layout}` : ""}`}
              style={{ ["--k" as string]: k }}
              onClick={() => openGallery(i, ids)}
              aria-label={`Ampliar foto: ${p.cap}`}
            >
              <img src={p.src} alt={p.alt} loading="lazy" width={p.w} height={p.h} style={{ objectPosition: p.pos }} />
              <span className="tile__cap">
                <span>{p.cap}</span>
                <LuZoomIn aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>

        <p className="fleet__note">
          A frota inclui vans e caminhões-baú. O veículo adequado para cada serviço é confirmado com a equipe no orçamento.{" "}
          <a className="link-arrow" href="#orcamento" onClick={(e) => { e.preventDefault(); scrollToId("orcamento"); }}>
            Pedir orçamento <LuArrowRight aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
