import { LINKS } from "../config/company";
import type { QuoteData } from "../types";
import { addressLines } from "./address";

export const formatDateBR = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/** Campos complementares que só fazem sentido para o serviço escolhido. */
export function serviceExtras(d: QuoteData) {
  return {
    estab: d.servico === "Mudança comercial" ? d.estab.trim() : "",
    tipoCarga: ["Frete", "Transporte de pequenos volumes", "Transporte de grandes volumes"].includes(d.servico) ? d.tipoCarga : "",
    outro: d.servico === "Outro" ? d.outro.trim() : "",
  };
}

/** Monta a mensagem do orçamento. Campos opcionais vazios são omitidos. */
export function buildQuoteMessage(d: QuoteData): string {
  const x = serviceExtras(d);
  const lines: string[] = ["Olá! Gostaria de solicitar um orçamento com a RAJ Transportes.", ""];
  const add = (label: string, value: string) => {
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  };
  lines.push("*Dados do cliente*");
  add("Nome", d.nome);
  add("Telefone", d.tel);
  add("E-mail", d.email);
  add("Empresa", d.empresa);
  lines.push("", "*Serviço*");
  add("Tipo", d.servico);
  add("Descrição do serviço", x.outro);
  add("Espaço comercial", x.estab);
  add("Tipo de carga", x.tipoCarga);
  add("Data desejada", formatDateBR(d.data));
  lines.push("", "*Origem (coleta)*");
  addressLines(d, "o").forEach(([k, v]) => add(k, v));
  lines.push("", "*Destino (entrega)*");
  addressLines(d, "d").forEach(([k, v]) => add(k, v));
  lines.push("", "*Detalhes da carga*");
  add("Descrição", d.desc);
  add("Volume aproximado", d.vol);
  add("Quantidade de caixas", d.caixas);
  add("Ajuda para carregar/descarregar", d.ajuda);
  add("Observações", d.obs);
  lines.push("", "Aguardo o retorno para verificar as condições do transporte.");
  return lines.join("\n");
}

export const whatsappUrl = (message: string) => `${LINKS.whatsapp}?text=${encodeURIComponent(message)}`;
