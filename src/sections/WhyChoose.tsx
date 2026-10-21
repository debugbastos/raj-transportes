import type { IconType } from "react-icons";
import { FaWhatsapp } from "react-icons/fa6";
import { LuArrowRight, LuClipboardList, LuHeadset, LuHouse, LuMedal, LuTruck } from "react-icons/lu";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { COMPANY } from "../config/company";
import { scrollToId } from "../lib/scroll";
import "./why.css";

/** Somente características confirmadas pela empresa. */
const REASONS: { icon: IconType; title: string; text: string }[] = [
  { icon: LuMedal, title: "Experiência no setor", text: "Mais de 10 anos de atuação no ramo de transportes, com fretes e mudanças." },
  { icon: LuHeadset, title: "Atendimento direto", text: "Você fala com o responsável pela empresa, do primeiro contato ao combinado final." },
  { icon: LuHouse, title: "Fretes e mudanças", text: "Mudanças residenciais e comerciais, fretes e transporte de pequenos a grandes volumes." },
  { icon: LuTruck, title: "Veículos para cada volume", text: "Vans e caminhões-baú, com o veículo adequado definido conforme a sua carga." },
  { icon: LuClipboardList, title: "Orçamento personalizado", text: "O valor considera o trajeto, o volume e as condições de coleta e entrega." },
  { icon: FaWhatsapp, title: "Comunicação pelo WhatsApp", text: "Pedido de orçamento e dúvidas resolvidos pelo canal que você já usa." },
];

export function WhyChoose() {
  return (
    <section className="section why" id="por-que" aria-labelledby="por-que-title">
      <div className="container">
        <SectionHeading id="por-que-title" eyebrow="Diferenciais" lead="Por que escolher a" strong="RAJ Transportes?">
          Experiência, atendimento próximo e veículos para diferentes necessidades de transporte.
        </SectionHeading>

        <div className="why__grid">
          <Reveal className="why__stat">
            <p className="why__number" aria-hidden="true">
              <span className="why__plus">+</span>10
            </p>
            <p className="why__years" aria-hidden="true">anos</p>
            <p className="why__claim">{COMPANY.experience}.</p>
            <svg className="why__road" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 50 C 90 50, 160 10, 300 10" />
            </svg>
            <a
              className="btn btn--primary"
              href="#orcamento"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("orcamento");
              }}
            >
              Solicitar orçamento <LuArrowRight aria-hidden="true" />
            </a>
          </Reveal>

          <ul className="why__list">
            {REASONS.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" className="why__card" key={title} delay={i * 60}>
                <span className="why__icon"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
