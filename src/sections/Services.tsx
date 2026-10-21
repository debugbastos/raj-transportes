import type { IconType } from "react-icons";
import { LuArrowRight, LuBoxes, LuBuilding2, LuHouse, LuTruck } from "react-icons/lu";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { SERVICES } from "../config/company";
import { useQuote } from "../context/QuoteContext";
import { useToast } from "../context/ToastContext";
import "./services.css";

const ICONS: Record<(typeof SERVICES)[number]["icon"], IconType> = { truck: LuTruck, home: LuHouse, building: LuBuilding2, boxes: LuBoxes };

export function Services() {
  const { chooseService } = useQuote();
  const toast = useToast();
  return (
    <section className="section services" id="servicos" aria-labelledby="servicos-title">
      <div className="container">
        <SectionHeading id="servicos-title" eyebrow="Serviços" lead="Uma solução de transporte" strong="para cada necessidade.">
          Da mudança residencial ao transporte de grandes volumes, encontre a opção mais adequada para sua demanda.
        </SectionHeading>
        <div className="services__grid">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon];
            const pick = (e: React.MouseEvent) => {
              e.preventDefault();
              chooseService(s.service);
              toast(`Serviço selecionado: ${s.service}`);
            };
            return (
              <Reveal as="article" className="service-card" key={s.key} delay={i * 80}>
                <a className="service-card__media" href="#orcamento" onClick={pick} tabIndex={-1} aria-hidden="true">
                  <img src={s.image} alt="" loading="lazy" style={{ objectPosition: s.imagePos }} />
                </a>
                <div className="service-card__body">
                  <span className="service-card__icon"><Icon aria-hidden="true" /></span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <a className="btn btn--outline btn--sm service-card__cta" href="#orcamento" onClick={pick}>
                    {s.cta} <LuArrowRight aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
