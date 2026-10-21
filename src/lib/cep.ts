// Consulta de CEP exclusivamente no ViaCEP (https://viacep.com.br/ws/CEP/json/).
// Só o CEP é enviado; nenhum outro dado do cliente.
// 1. fetch direto ao endpoint oficial.
// 2. Se o fetch não conseguir chegar ao ViaCEP (rede, extensão ou navegador que bloqueia requisições
//    entre sites), o mesmo endpoint oficial é chamado no formato JSONP que o próprio ViaCEP oferece
//    (…/json/?callback=…), carregado como script. Continua sendo a API do ViaCEP, sem outro serviço.
import { onlyDigits } from "./phone";

/** Campos do ViaCEP usados pelo formulário (vazios quando o ViaCEP não os informa). */
export interface CepAddress {
  cep: string;
  street: string; // logradouro
  complement: string; // complemento
  district: string; // bairro
  city: string; // localidade
  uf: string; // uf
  state: string; // estado (por extenso, quando informado)
}

export type CepResult = { kind: "found"; address: CepAddress } | { kind: "notfound" };

export class CepNetworkError extends Error {
  /** A consulta foi barrada pelo ambiente (política de segurança da página), não por falha do ViaCEP. */
  blocked = false;
}

// Ambientes como a pré-visualização do claude.ai bloqueiam requisições a sites externos.
// O navegador avisa pelo evento "securitypolicyviolation".
let blockedByPolicy = false;
if (typeof document !== "undefined") {
  document.addEventListener("securitypolicyviolation", (e) => {
    if (String(e.blockedURI).includes("viacep.com.br")) blockedByPolicy = true;
  });
}

/** 00000-000 enquanto o usuário digita (aceita colar com ou sem hífen, pontos ou espaços). */
export function formatCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export const isCompleteCep = (value: string) => onlyDigits(value).length === 8;

const TIMEOUT_MS = 8000;
const ENDPOINT = (cep: string) => `https://viacep.com.br/ws/${cep}/json/`;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Interpreta a resposta do ViaCEP. null = resposta inesperada. */
function parse(cep: string, j: unknown): CepResult | null {
  if (!j || typeof j !== "object") return null;
  const d = j as Record<string, unknown>;
  if (d.erro === true || d.erro === "true") return { kind: "notfound" };
  const city = str(d.localidade);
  const uf = str(d.uf).toUpperCase();
  if (!city || !/^[A-Z]{2}$/.test(uf)) return null;
  return {
    kind: "found",
    address: { cep, street: str(d.logradouro), complement: str(d.complemento), district: str(d.bairro), city, uf, state: str(d.estado) },
  };
}

class HttpError extends Error {}

/** Consulta por fetch. Lança erro em falha de rede, tempo esgotado ou HTTP malsucedido. */
async function viaFetch(cep: string, signal: AbortSignal): Promise<CepResult> {
  const timeout = new AbortController();
  const timer = window.setTimeout(() => timeout.abort(), TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal.addEventListener("abort", onAbort);
  try {
    // Sem cabeçalhos personalizados: requisição "simples", sem pré-verificação de CORS.
    const res = await fetch(ENDPOINT(cep), { signal: timeout.signal, credentials: "omit" });
    if (res.status === 400) return { kind: "notfound" }; // formato de CEP inválido
    if (!res.ok) throw new HttpError(`HTTP ${res.status}`);
    const result = parse(cep, await res.json());
    if (!result) throw new HttpError("Resposta inesperada");
    return result;
  } finally {
    window.clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}

let jsonpSeq = 0;
/** Mesmo endpoint do ViaCEP no formato JSONP. Resolve null se também não conseguir chegar ao ViaCEP. */
function viaJsonp(cep: string, signal: AbortSignal): Promise<CepResult | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined" || signal.aborted) return resolve(null);
    const name = `__rajCep${Date.now()}_${jsonpSeq++}`;
    const w = window as unknown as Record<string, unknown>;
    const script = document.createElement("script");
    let done = false;
    const finish = (r: CepResult | null) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      delete w[name];
      script.remove();
      resolve(r);
    };
    const onAbort = () => finish(null);
    const timer = window.setTimeout(() => finish(null), TIMEOUT_MS);
    signal.addEventListener("abort", onAbort);
    w[name] = (j: unknown) => finish(parse(cep, j));
    script.src = `${ENDPOINT(cep)}?callback=${name}`;
    script.async = true;
    script.onerror = () => finish(null);
    document.head.appendChild(script);
  });
}

/**
 * Consulta o CEP no ViaCEP.
 * Retorna o endereço ou "notfound" ({"erro": true}).
 * Lança CepNetworkError se o ViaCEP não puder ser consultado (rede, HTTP, resposta inválida).
 * Lança o AbortError original se a consulta for cancelada (CEP alterado no meio da busca).
 */
export async function fetchCep(cep: string, signal: AbortSignal): Promise<CepResult> {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) throw new CepNetworkError("CEP incompleto");
  let reason = "";
  try {
    return await viaFetch(digits, signal);
  } catch (err) {
    if (signal.aborted) throw err;
    reason = err instanceof HttpError ? err.message : "rede";
  }
  // fetch não chegou ao ViaCEP: tenta o mesmo endpoint por JSONP.
  const viaScript = await viaJsonp(digits, signal);
  if (signal.aborted) throw new DOMException("Consulta cancelada", "AbortError");
  if (viaScript) return viaScript;
  if (!blockedByPolicy) await new Promise((r) => window.setTimeout(r, 60)); // o aviso de bloqueio pode chegar depois
  // Sem dados do cliente no console: só o tipo de falha.
  console.warn(`Consulta de CEP ao ViaCEP indisponível (${reason || "rede"}).`);
  const failure = new CepNetworkError(reason || "rede");
  failure.blocked = blockedByPolicy;
  throw failure;
}
