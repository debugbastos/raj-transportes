// Dados oficiais da empresa e conteúdo da página, centralizados em um único lugar.
import heroImage from "../assets/hero/hero-raj-transportes-frota.jpg";
import loading from "../assets/fleet/carregamento-van.jpg";
import truckBlueFront from "../assets/fleet/caminhao-bau-azul-frente.jpg";
import truckBlueSide from "../assets/fleet/caminhao-bau-azul-lateral.jpg";
import truckDisk from "../assets/fleet/caminhao-cargo-disk-frete.jpg";
import truckFretes from "../assets/fleet/caminhao-cargo-fretes-mudancas.jpg";
import truckStreet from "../assets/fleet/caminhao-cargo-rua.jpg";
import vanFront from "../assets/fleet/van-sprinter-frente.jpg";
import vanSide from "../assets/fleet/van-sprinter-lateral.jpg";
import vanLong from "../assets/fleet/van-sprinter-longa.jpg";
import vanPlaza from "../assets/fleet/van-sprinter-praca.jpg";
import vanRear from "../assets/fleet/van-sprinter-traseira.jpg";
import type { Photo, ServiceName } from "../types";

export const COMPANY = {
  name: "RAJ Transportes",
  owner: "Ridan",
  phoneDisplay: "(32) 98815-0081",
  phoneE164: "+5532988150081",
  whatsappNumber: "5532988150081",
  email: "ridanjf98@gmail.com",
  /** Instagram oficial */
  instagram: "@rajtransportesjf",
  area: "Todo o Brasil",
  hq: "Juiz de Fora — MG",
  hqLong: "Juiz de Fora, Minas Gerais",
  experience: "Mais de 10 anos de atuação no ramo de transportes",
  motto: "Você contrata e nós entregamos!",
  commitment: "Nosso compromisso: excelência em cada entrega.",
} as const;

const WA_HELLO = "Olá! Conheci a RAJ Transportes pelo site e gostaria de tirar uma dúvida sobre os serviços de frete e mudança.";

export const LINKS = {
  whatsapp: `https://wa.me/${COMPANY.whatsappNumber}`,
  /** Abre a conversa com uma mensagem inicial curta; o cliente decide se envia. */
  whatsappHello: `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(WA_HELLO)}`,
  tel: `tel:${COMPANY.phoneE164}`,
  mail: `mailto:${COMPANY.email}`,
  /** Pesquisa pela cidade e estado; nenhum endereço exato é informado. */
  maps: "https://www.google.com/maps/search/?api=1&query=Juiz%20de%20Fora%20-%20MG",
  /** Perfil oficial no Instagram. No celular, o próprio sistema abre o app do Instagram quando instalado. */
  instagram: "https://www.instagram.com/rajtransportesjf/",
} as const;

export const HERO_IMAGE = { src: heroImage, w: 1561, h: 1008, alt: "Frota da RAJ Transportes ao pôr do sol: dois caminhões-baú e duas vans Sprinter lado a lado, com a logomarca da empresa no céu" };

/** Links do menu no desktop. O menu do celular inclui também as seções de apoio. */
export const NAV = [
  { id: "inicio", label: "Início" },
  { id: "por-que", label: "Por que a RAJ" },
  { id: "empresa", label: "A empresa" },
  { id: "servicos", label: "Serviços" },
  { id: "frota", label: "Frota" },
  { id: "contato", label: "Contato" },
] as const;

export const MOBILE_NAV = [
  { id: "inicio", label: "Início" },
  { id: "por-que", label: "Por que a RAJ" },
  { id: "empresa", label: "A empresa" },
  { id: "servicos", label: "Serviços" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "frota", label: "Frota" },
  { id: "sede", label: "Nossa sede" },
  { id: "faq", label: "Dúvidas frequentes" },
  { id: "contato", label: "Contato" },
] as const;

export const SERVICE_OPTIONS: ServiceName[] = [
  "Frete",
  "Mudança residencial",
  "Mudança comercial",
  "Transporte de pequenos volumes",
  "Transporte de grandes volumes",
  "Outro",
];

export const SERVICES: {
  key: string;
  title: string;
  text: string;
  cta: string;
  service: ServiceName;
  image: string;
  imagePos: string;
  icon: "truck" | "home" | "building" | "boxes";
}[] = [
  {
    key: "fretes",
    title: "Fretes",
    text: "Transporte de mercadorias, móveis, caixas e outros volumes, com solicitação de orçamento conforme as características da carga e do trajeto.",
    cta: "Solicitar frete",
    service: "Frete",
    image: vanLong,
    imagePos: "50% 62%",
    icon: "truck",
  },
  {
    key: "residencial",
    title: "Mudanças residenciais",
    text: "Transporte dos seus pertences para um novo endereço, com planejamento conforme o volume, os locais de coleta e entrega e as necessidades da mudança.",
    cta: "Planejar minha mudança",
    service: "Mudança residencial",
    image: truckFretes,
    imagePos: "62% 55%",
    icon: "home",
  },
  {
    key: "comercial",
    title: "Mudanças comerciais",
    text: "Transporte de móveis, caixas, equipamentos e materiais para mudanças de espaços comerciais, conforme a necessidade do cliente.",
    cta: "Solicitar orçamento",
    service: "Mudança comercial",
    image: vanRear,
    imagePos: "50% 55%",
    icon: "building",
  },
  {
    key: "grandes",
    title: "Grandes volumes",
    text: "Soluções de transporte para cargas maiores, com avaliação do volume, peso, veículo adequado e condições de acesso aos locais.",
    cta: "Consultar transporte",
    service: "Transporte de grandes volumes",
    image: truckBlueSide,
    imagePos: "45% 55%",
    icon: "boxes",
  },
];

/**
 * Galeria da frota. A ordem forma um mosaico sem buracos:
 * 3 colunas = destaque 2x2 + 4 fotos altas + 6 normais (18 células);
 * 2 colunas = destaque 2x1 + 4 altas + 6 normais (16 células).
 */
export const PHOTOS: Photo[] = [
  { src: truckBlueSide, w: 1296, h: 831, cat: "caminhao", layout: "feature", pos: "50% 55%", cap: "Caminhão-baú, vista lateral", alt: "Caminhão-baú de cabine azul com as palavras Fretes e Mudanças pintadas no baú" },
  { src: vanPlaza, w: 768, h: 1364, cat: "van", layout: "tall", pos: "50% 52%", cap: "Van Sprinter em viagem", alt: "Van Sprinter branca estacionada em uma praça de calçamento, com estrada e morros ao fundo" },
  { src: vanRear, w: 784, h: 1340, cat: "van", layout: "tall", pos: "50% 55%", cap: "Van Sprinter, portas traseiras", alt: "Traseira de uma van Sprinter branca com Disk Frete (32) 98815-0081 nas portas" },
  { src: truckDisk, w: 1400, h: 788, cat: "caminhao", layout: "normal", pos: "55% 50%", cap: "Caminhão Cargo 815", alt: "Caminhão Ford Cargo 815 prata com Disk Frete e o telefone no para-brisa" },
  { src: truckBlueFront, w: 1400, h: 1050, cat: "caminhao", layout: "normal", pos: "45% 55%", cap: "Caminhão-baú azul, vista frontal", alt: "Frente de um caminhão-baú Ford de cabine azul estacionado na rua" },
  { src: vanSide, w: 1400, h: 846, cat: "van", layout: "normal", pos: "45% 55%", cap: "Van Sprinter teto alto", alt: "Van Sprinter branca de teto alto estacionada em uma rua arborizada" },
  { src: loading, w: 1205, h: 1205, cat: "carga", layout: "normal", pos: "50% 55%", cap: "Carregamento de caixas", alt: "Caixas sendo carregadas em uma van com portas traseiras abertas, com auxílio de um carrinho de carga" },
  { src: vanFront, w: 704, h: 956, cat: "van", layout: "tall", pos: "50% 55%", cap: "Van Sprinter, vista frontal", alt: "Van Sprinter branca com Disk Frete no para-brisa estacionada em uma rua residencial" },
  { src: vanLong, w: 896, h: 1170, cat: "van", layout: "tall", pos: "50% 55%", cap: "Van Sprinter longa", alt: "Van Sprinter longa branca estacionada em um calçamento sextavado" },
  { src: truckFretes, w: 1400, h: 787, cat: "caminhao", layout: "normal", pos: "60% 50%", cap: "Caminhão-baú Fretes e Mudanças", alt: "Caminhão Ford Cargo 815 prata com Fretes Mudanças e o telefone pintados no baú" },
  { src: truckStreet, w: 1080, h: 608, cat: "caminhao", layout: "normal", pos: "45% 55%", cap: "Caminhão-baú na rua", alt: "Caminhão Ford Cargo 815 prata com baú, estacionado em frente a uma casa" },
];

export const ABOUT_PHOTOS = { main: PHOTOS[10], inset: PHOTOS[6] };

export const FAQ: {
  q: string;
  a: string;
  link?: { label: string; href: string; service?: ServiceName; step?: number };
  whatsapp?: boolean;
}[] = [
  {
    q: "Como posso entrar em contato com a RAJ Transportes?",
    a: "Você pode preencher o formulário para solicitar um orçamento ou falar diretamente com nossa equipe pelo WhatsApp para tirar dúvidas sobre os serviços.",
    whatsapp: true,
  },
  {
    q: "A RAJ Transportes realiza fretes para outros estados?",
    a: "A empresa informa que atende todo o Brasil. Para verificar as condições do seu trajeto, entre em contato e informe as cidades de origem e destino.",
    link: { label: "Informar meu trajeto", href: "#orcamento", step: 3 },
  },
  {
    q: "A empresa realiza mudanças residenciais?",
    a: "Sim. A RAJ Transportes oferece serviços de mudanças. Envie informações sobre os locais de coleta e entrega e sobre o volume aproximado dos itens para solicitar um orçamento.",
    link: { label: "Planejar minha mudança", href: "#orcamento", service: "Mudança residencial" },
  },
  {
    q: "Quais veículos estão disponíveis?",
    a: "A frota informada inclui vans e caminhões-baú. O veículo adequado depende das características de cada transporte e deve ser confirmado com a equipe.",
    link: { label: "Ver as fotos da frota", href: "#frota" },
  },
  {
    q: "Como faço para solicitar um orçamento?",
    a: "Preencha o formulário com seus dados, informe o tipo de serviço, os endereços de origem e destino e os detalhes da carga. Em seguida, encaminhe a solicitação pelo WhatsApp.",
    link: { label: "Abrir o formulário", href: "#orcamento" },
  },
  {
    q: "Como é definido o valor do frete?",
    a: "O orçamento depende das características do serviço, incluindo o trajeto, o volume transportado e as condições da coleta e entrega. Entre em contato para avaliar sua necessidade.",
    link: { label: "Falar com a equipe", href: "#contato" },
  },
  {
    q: "Posso informar uma data específica para o transporte?",
    a: "Sim. Informe a data desejada no formulário para que a equipe possa avaliar as condições do atendimento.",
    link: { label: "Informar a data", href: "#orcamento", step: 4 },
  },
];

export const UFS: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal",
  ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais",
  PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};
