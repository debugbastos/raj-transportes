import { LuArrowRight, LuExternalLink, LuMapPin } from "react-icons/lu";
import { Reveal } from "../components/Reveal";
import { COMPANY, LINKS } from "../config/company";
import { useQuote } from "../context/QuoteContext";
import "./location.css";

/**
 * Sede da empresa. Composição inspirada na imagem de referência (anexo 2):
 * texto e tópicos com marcador à esquerda, cartão da sede à direita.
 * Mostra só cidade e estado; nenhum endereço é exibido.
 */
export function Location() {
  const { openForm } = useQuote();
  const points = [
    { title: `Sede em ${COMPANY.hq}`, text: "A base da RAJ Transportes fica em Juiz de Fora, na Zona da Mata mineira." },
    { title: "Atendimento em todo o Brasil", text: "Fretes e mudanças para outras cidades e estados, conforme avaliação da equipe." },
    { title: "Trajeto confirmado no orçamento", text: "Informe a origem e o destino para a equipe verificar as condições do seu transporte." },
  ];
  return (
    <section className="section section--navy location" id="sede" aria-labelledby="sede-title">
      <div className="container location__grid">
        <div className="location__copy">
          <Reveal as="p" className="eyebrow">Nossa sede</Reveal>
          <Reveal as="h2" className="location__title" id="sede-title" delay={60}>
            De Juiz de Fora <span>para todo o Brasil</span>
          </Reveal>
          <Reveal as="p" className="location__lede" delay={120}>
            A RAJ Transportes tem sede em {COMPANY.hqLong}. A partir daqui, a empresa atende solicitações de fretes e mudanças em todo o país.
          </Reveal>
          <ul className="location__points">
            {points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={160 + i * 70}>
                <LuMapPin aria-hidden="true" />
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="hq-card" delay={120}>
          <div className="hq-card__pin" aria-hidden="true">
            <span className="hq-card__ring" />
            <span className="hq-card__dot" />
          </div>
          <p className="hq-card__label">Nossa sede</p>
          <p className="hq-card__city">{COMPANY.hq}</p>
          <dl className="hq-card__facts">
            <div>
              <dt>DDD</dt>
              <dd>32</dd>
            </div>
            <div>
              <dt>Anos no ramo</dt>
              <dd>10+</dd>
            </div>
          </dl>
          <div className="hq-card__actions">
            <a className="btn btn--light" href={LINKS.maps} target="_blank" rel="noopener noreferrer">
              Ver no Google Maps <LuExternalLink aria-hidden="true" />
            </a>
            <a
              className="link-arrow link-arrow--light"
              href="#orcamento"
              onClick={(e) => {
                e.preventDefault();
                openForm(3);
              }}
            >
              Informar meu trajeto <LuArrowRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
