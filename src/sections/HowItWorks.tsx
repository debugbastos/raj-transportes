import type { IconType } from "react-icons";
import { LuArrowRight, LuClipboardList, LuHandshake, LuMessageSquareText, LuRoute } from "react-icons/lu";
import { SectionHeading } from "../components/SectionHeading";
import { useQuote } from "../context/QuoteContext";
import { useInView } from "../hooks/useInView";
import { scrollToId } from "../lib/scroll";
import type { QuoteStep } from "../types";
import "./how.css";

const STEPS: { icon: IconType; title: string; text: string; cta: string; target: "form" | "contato"; formStep?: QuoteStep }[] = [
  { icon: LuClipboardList, title: "Conte o que precisa transportar", text: "O cliente informa o tipo de serviço, o que será transportado, o endereço de coleta e o destino.", cta: "Escolher serviço", target: "form", formStep: 2 },
  { icon: LuRoute, title: "Envie os detalhes da viagem", text: "Informe os locais de origem e destino, o volume aproximado da carga, a data desejada e as condições relevantes para a coleta e a entrega.", cta: "Informar trajeto", target: "form", formStep: 3 },
  { icon: LuMessageSquareText, title: "Receba o atendimento e o orçamento", text: "A equipe entra em contato para entender a necessidade, verificar as condições do serviço e avaliar o orçamento.", cta: "Falar com a equipe", target: "contato" },
  { icon: LuHandshake, title: "Combine os detalhes e organize o transporte", text: "Após o alinhamento das condições, são combinados os detalhes da contratação, da coleta e da entrega.", cta: "Começar agora", target: "form", formStep: 1 },
];

export function HowItWorks() {
  const { openForm } = useQuote();
  const { ref, inView } = useInView<HTMLOListElement>("0px 0px -20% 0px");
  return (
    <section className="section how" id="como-funciona" aria-labelledby="como-title">
      <div className="container">
        <SectionHeading id="como-title" eyebrow="Como funciona" lead="Do primeiro contato ao destino:" strong="veja como funciona." />
        <ol ref={ref} className={`how__steps${inView ? " is-in" : ""}`}>
          {STEPS.map(({ icon: Icon, title, text, cta, target, formStep }, i) => (
            <li className="how__step" key={title} style={{ ["--i" as string]: i }}>
              <div className="how__marker">
                <span className="how__num">{i + 1}</span>
                {i < STEPS.length - 1 && <span className="how__line" aria-hidden="true"><span /></span>}
              </div>
              <div className="how__body">
                <Icon className="how__icon" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
                <a
                  className="how__cta"
                  href={target === "form" ? "#orcamento" : "#contato"}
                  onClick={(e) => {
                    e.preventDefault();
                    if (target === "form") openForm(formStep);
                    else scrollToId("contato");
                  }}
                >
                  {cta} <LuArrowRight aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
