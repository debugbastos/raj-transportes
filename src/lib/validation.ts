import { ADDRESS_PARTS, type QuoteData, type QuoteErrors, type QuoteField, type QuoteStep } from "../types";
import { isApartment } from "./address";
import { onlyDigits, isValidBrazilianPhone } from "./phone";

export const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Ordem em que os campos aparecem na tela, usada para focar o primeiro erro. */
export const FIELD_ORDER: QuoteField[] = [
  "nome", "tel", "email", "empresa",
  "servico", "outro",
  ...(["o", "d"] as const).flatMap((side) => ADDRESS_PARTS.map((p) => `${side}${p}` as QuoteField)),
  "desc", "data",
  "consent",
];

const ADDRESS_LABEL: Record<(typeof ADDRESS_PARTS)[number], string> = {
  Cep: "CEP", Rua: "Rua", Num: "Número", Comp: "Complemento", Tipo: "Tipo de imóvel",
  Andar: "Andar", Apto: "Nº do apartamento", Interf: "Interfone",
  Bairro: "Bairro", Cid: "Cidade", UF: "Estado (UF)",
};

/** Nome do campo como aparece na tela, usado no resumo de pendências. */
export function fieldLabel(f: QuoteField): string {
  const base: Partial<Record<QuoteField, string>> = {
    nome: "Nome completo", tel: "Telefone ou WhatsApp", email: "E-mail", empresa: "Empresa",
    servico: "Tipo de serviço", outro: "Descrição do serviço",
    desc: "Descrição dos itens ou da carga", data: "Data desejada",
    consent: "Concordância com a política de privacidade",
  };
  if (base[f]) return base[f]!;
  const side = f[0] === "o" ? "Origem" : "Destino";
  const part = f.slice(1) as (typeof ADDRESS_PARTS)[number];
  return `${side}: ${ADDRESS_LABEL[part] ?? f}`;
}

/** Campos com erro, na ordem da tela. */
export const errorFields = (errors: QuoteErrors): QuoteField[] => FIELD_ORDER.filter((f) => errors[f]);

/** Valida somente os campos obrigatórios (e os opcionais preenchidos com formato inválido). */
export function validateStep(step: QuoteStep, d: QuoteData): QuoteErrors {
  const e: QuoteErrors = {};
  if (step === 1) {
    if (d.nome.trim().length < 3) e.nome = d.nome.trim() ? "Informe o nome completo." : "Informe seu nome.";
    if (!d.tel.trim()) e.tel = "Informe um telefone com DDD.";
    else if (!isValidBrazilianPhone(d.tel)) e.tel = "Telefone inválido. Use DDD + número, ex.: (32) 99999-9999.";
    if (d.email.trim() && !EMAIL.test(d.email.trim())) e.email = "E-mail inválido. Corrija ou deixe em branco.";
  }
  if (step === 2) {
    if (!d.servico) e.servico = "Escolha o tipo de serviço.";
    if (d.servico === "Outro" && !d.outro.trim()) e.outro = "Descreva o serviço que você precisa.";
  }
  if (step === 3) {
    // Todos os campos do endereço são obrigatórios, exceto o número do apartamento.
    // Andar e interfone só valem quando o imóvel é apartamento. Espaços em branco não contam como preenchimento.
    for (const side of ["o", "d"] as const) {
      const de = side === "o" ? "de origem" : "de destino";
      const v = (part: string) => String(d[`${side}${part}` as QuoteField] ?? "").trim();
      const cep = onlyDigits(v("Cep"));
      if (!cep) e[`${side}Cep`] = `Informe o CEP ${de}.`;
      else if (cep.length !== 8) e[`${side}Cep`] = "CEP incompleto. Use os 8 números, no formato 00000-000.";
      if (!v("Rua")) e[`${side}Rua`] = `Informe a rua ou avenida ${de}.`;
      if (!v("Num")) e[`${side}Num`] = "Informe o número.";
      if (!v("Comp")) e[`${side}Comp`] = "Informe o complemento ou marque “Não se aplica”.";
      if (!v("Tipo")) e[`${side}Tipo`] = "Escolha o tipo de imóvel.";
      if (isApartment(d, side)) {
        if (!v("Andar")) e[`${side}Andar`] = "Informe o andar do apartamento.";
        if (!v("Interf")) e[`${side}Interf`] = "Informe o interfone ou marque “Não possui”.";
      }
      if (!v("Bairro")) e[`${side}Bairro`] = `Informe o bairro ${de}.`;
      if (!v("Cid")) e[`${side}Cid`] = `Informe a cidade ${de}.`;
      if (!v("UF")) e[`${side}UF`] = `Escolha o estado ${de}.`;
    }
  }
  if (step === 4) {
    if (d.desc.trim().length < 3) e.desc = "Descreva o que será transportado.";
    if (d.data && d.data < todayISO()) e.data = "Escolha uma data a partir de hoje ou deixe em branco.";
  }
  if (step === 5) {
    if (!d.consent) e.consent = "Marque a concordância para continuar.";
  }
  return e;
}

export function firstErrorField(errors: QuoteErrors): QuoteField | undefined {
  return FIELD_ORDER.find((f) => errors[f]);
}
