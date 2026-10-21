import { LuArrowDown, LuArrowRight } from "react-icons/lu";
import { HERO_IMAGE } from "../config/company";
import { scrollToId } from "../lib/scroll";
import "./hero.css";

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  scrollToId(id);
};

/**
 * Hero cinematográfico adaptado à fotografia (e não o contrário).
 * A área da imagem tem exatamente a proporção da foto (aspect-ratio 1561 / 1008) e a largura toda da tela,
 * então a foto única preenche 100% dessa área, inteira, sem cortes, sem deformação e sem espaços vazios.
 * Em telas largas, o texto fica sobre a faixa de cascalho na base da foto (abaixo das rodas dos veículos);
 * em telas estreitas, onde essa faixa é baixa demais para o texto, ele vem logo abaixo da foto.
 */
export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title" style={{ ["--photo-ratio" as string]: `${HERO_IMAGE.w} / ${HERO_IMAGE.h}` }}>
      <div className="hero__media">
        <img className="hero__photo" src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} width={HERO_IMAGE.w} height={HERO_IMAGE.h} fetchPriority="high" decoding="async" />
        <div className="hero__overlay" aria-hidden="true" />
      </div>

      <div className="hero__content">
        <div className="container">
          <div className="hero__inner">
            {/* 1. Título principal */}
            <h1 className="hero__title hero-in" id="hero-title" style={{ ["--d" as string]: "250ms" }}>
              Fretes e mudanças <span className="hero__title-accent">para todo o Brasil.</span>
            </h1>
            {/* 2. Texto complementar */}
            <p className="hero__tagline hero-in" style={{ ["--d" as string]: "420ms" }}>
              Experiência e compromisso em cada trajeto.
            </p>
            {/* 3. Ações */}
            <div className="hero__ctas hero-in" style={{ ["--d" as string]: "560ms" }}>
              <a className="btn btn--primary btn--lg" href="#orcamento" onClick={go("orcamento")}>
                Solicitar orçamento <LuArrowRight aria-hidden="true" />
              </a>
              <a className="btn btn--ghost-light btn--lg" href="#por-que" onClick={go("por-que")}>
                Conheça a RAJ <LuArrowDown aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
