import { ADDRESS_PARTS, type QuoteData, type RouteSide } from "../types";

/** Texto gravado quando o cliente marca que não há complemento. */
export const NO_COMPLEMENT = "Não se aplica";
/** Texto gravado quando o apartamento não tem interfone. */
export const NO_INTERCOM = "Não possui";

export const PROPERTY_TYPES = ["Casa", "Apartamento", "Outro"] as const;

export const SIDE_TITLE: Record<RouteSide, string> = {
  o: "Endereço de origem — coleta",
  d: "Endereço de destino — entrega",
};

export const emptyAddress = (side: RouteSide) =>
  Object.fromEntries(ADDRESS_PARTS.map((p) => [`${side}${p}`, ""])) as Pick<QuoteData, `${RouteSide}${(typeof ADDRESS_PARTS)[number]}`>;

const get = (d: QuoteData, side: RouteSide, part: (typeof ADDRESS_PARTS)[number]) => d[`${side}${part}`].trim();

export const isApartment = (d: QuoteData, side: RouteSide) => d[`${side}Tipo`] === "Apartamento";

/**
 * Linhas do endereço para a revisão e para a mensagem do WhatsApp.
 * Campos de apartamento só entram quando o tipo é "Apartamento"; o número do apartamento só entra se foi informado.
 */
export function addressLines(d: QuoteData, side: RouteSide): [string, string][] {
  const street = [get(d, side, "Rua"), get(d, side, "Num")].filter(Boolean).join(", ");
  const city = [get(d, side, "Cid"), get(d, side, "UF")].filter(Boolean).join(" / ");
  const rows: [string, string][] = [
    ["CEP", get(d, side, "Cep")],
    ["Endereço", street],
    ["Complemento", get(d, side, "Comp")],
    ["Tipo de imóvel", get(d, side, "Tipo")],
  ];
  if (isApartment(d, side)) {
    rows.push(["Andar", get(d, side, "Andar")], ["Apartamento", get(d, side, "Apto")], ["Interfone", get(d, side, "Interf")]);
  }
  rows.push(["Bairro", get(d, side, "Bairro")], ["Cidade/UF", city]);
  return rows.filter(([, v]) => v);
}
