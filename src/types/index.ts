export type ServiceName =
  | "Frete"
  | "Mudança residencial"
  | "Mudança comercial"
  | "Transporte de pequenos volumes"
  | "Transporte de grandes volumes"
  | "Outro";

export type PhotoCategory = "van" | "caminhao" | "carga";

export interface Photo {
  src: string;
  w: number;
  h: number;
  cat: PhotoCategory;
  /** Ocupação na galeria completa: destaque 2x2, alta 1x2 ou normal 1x1. */
  layout: "feature" | "tall" | "normal";
  pos: string;
  cap: string;
  alt: string;
}

/** Campos de um endereço (origem ou destino), na ordem do formulário. */
export const ADDRESS_PARTS = ["Cep", "Rua", "Num", "Comp", "Tipo", "Andar", "Apto", "Interf", "Bairro", "Cid", "UF"] as const;
export type AddressPart = (typeof ADDRESS_PARTS)[number];
export type PropertyType = "" | "Casa" | "Apartamento" | "Outro";

type AddressFields<P extends string> = { [K in AddressPart as `${P}${K}`]: string };

export interface QuoteBase {
  nome: string;
  tel: string;
  email: string;
  empresa: string;
  servico: ServiceName | "";
  estab: string;
  tipoCarga: string;
  outro: string;
  data: string;
  desc: string;
  vol: string;
  caixas: string;
  ajuda: string;
  obs: string;
  consent: boolean;
}

export type QuoteData = QuoteBase & AddressFields<"o"> & AddressFields<"d">;

export type QuoteField = keyof QuoteData;
export type QuoteErrors = Partial<Record<QuoteField, string>>;
export type QuoteStep = 1 | 2 | 3 | 4 | 5;

/** "o" = origem (coleta), "d" = destino (entrega). */
export type RouteSide = "o" | "d";

export type CepState =
  | { status: "idle" }
  | { status: "loading"; cep: string }
  | { status: "found"; cep: string; city: string; uf: string }
  | { status: "notfound"; cep: string }
  | { status: "error"; cep: string; /** true quando o ambiente bloqueia o acesso ao ViaCEP (ex.: pré-visualização do claude.ai) */ blocked?: boolean; };
