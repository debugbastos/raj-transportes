import { LuArrowRight } from "react-icons/lu";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { useGallery } from "../components/Lightbox";
import { ABOUT_PHOTOS, COMPANY, PHOTOS } from "../config/company";
import { scrollToId } from "../lib/scroll";
import "./about.css";

export function About() {
  const openGallery = useGallery();
  const { main, inset } = ABOUT_PHOTOS;
  return (
    <section className="section about" id="empresa" aria-labelledby="empresa-title">
      <div className="container about__grid">
        <div className="about__copy">
          <SectionHeading id="empresa-title" eyebrow="A empresa" lead="Compromisso com cada trajeto." strong="Cuidado com o que importa." />
          <Reveal className="about__text" delay={120}>
            <p>A RAJ Transportes atua com fretes e mudanças, atendendo diferentes necessidades de transporte de pequenos a grandes volumes. Com opções de veículos como vans e caminhões-baú, a empresa atende clientes que precisam transportar seus pertences, móveis, mercadorias e outros itens.</p>
            <p>Com atendimento em todo o Brasil, a RAJ Transportes busca oferecer um serviço pautado no compromisso, na qualidade e na excelência em cada entrega.</p>
            <p>Nosso objetivo é facilitar cada etapa do transporte, desde o primeiro contato até o planejamento da coleta e do destino.</p>
          </Reveal>
          <Reveal className="about__motto" delay={160}>
            <span>{COMPANY.motto}</span>
          </Reveal>
          <Reveal className="about__actions" delay={200}>
            <a className="btn btn--primary" href="#orcamento" onClick={(e) => { e.preventDefault(); scrollToId("orcamento"); }}>
              Solicitar orçamento <LuArrowRight aria-hidden="true" />
            </a>
            <a className="link-arrow" href="#frota" onClick={(e) => { e.preventDefault(); scrollToId("frota"); }}>
              Conhecer a frota <LuArrowRight aria-hidden="true" />
            </a>
          </Reveal>
        </div>
        <Reveal className="about__media" delay={80}>
          <button type="button" className="about__main" onClick={() => openGallery(PHOTOS.indexOf(main))} aria-label={`Ampliar foto: ${main.cap}`}>
            <img src={main.src} alt={main.alt} loading="lazy" width={main.w} height={main.h} />
          </button>
          <button type="button" className="about__inset" onClick={() => openGallery(PHOTOS.indexOf(inset))} aria-label={`Ampliar foto: ${inset.cap}`}>
            <img src={inset.src} alt={inset.alt} loading="lazy" width={inset.w} height={inset.h} />
          </button>
          <p className="about__note">Caminhão-baú da frota e carregamento de caixas em van.</p>
        </Reveal>
      </div>
    </section>
  );
}
