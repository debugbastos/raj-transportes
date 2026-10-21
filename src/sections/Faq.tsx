import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { LuArrowRight, LuPlus } from "react-icons/lu";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { FAQ, LINKS } from "../config/company";
import { useQuote } from "../context/QuoteContext";
import { scrollToId } from "../lib/scroll";
import "./faq.css";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { chooseService, openForm } = useQuote();
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <SectionHeading id="faq-title" eyebrow="Dúvidas frequentes" lead="Perguntas" strong="frequentes.">
          Não encontrou sua resposta?{" "}
          <a href={LINKS.whatsappHello} target="_blank" rel="noopener noreferrer">Pergunte pelo WhatsApp</a>.
        </SectionHeading>
        <Reveal className="faq__list" delay={80}>
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`qa${isOpen ? " is-open" : ""}`} key={item.q}>
                <h3>
                  <button type="button" id={`q-${i}`} aria-expanded={isOpen} aria-controls={`a-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <span>{item.q}</span>
                    <span className="qa__icon"><LuPlus aria-hidden="true" /></span>
                  </button>
                </h3>
                <div className="qa__panel" id={`a-${i}`} role="region" aria-labelledby={`q-${i}`} inert={!isOpen}>
                  <div>
                    <p>{item.a}</p>
                    {item.whatsapp && (
                      <div className="qa__actions">
                        <a className="btn btn--wa btn--sm" href={LINKS.whatsappHello} target="_blank" rel="noopener noreferrer" tabIndex={isOpen ? undefined : -1}>
                          <FaWhatsapp aria-hidden="true" /> Falar pelo WhatsApp
                        </a>
                        <a
                          className="link-arrow"
                          href="#orcamento"
                          onClick={(e) => {
                            e.preventDefault();
                            openForm();
                          }}
                        >
                          Preencher o formulário <LuArrowRight aria-hidden="true" />
                        </a>
                      </div>
                    )}
                    {item.link && (
                      <a
                        className="link-arrow"
                        href={item.link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          const l = item.link!;
                          if (l.service) chooseService(l.service);
                          else if (l.href === "#orcamento") openForm(l.step as 1 | 2 | 3 | 4 | 5 | undefined);
                          else scrollToId(l.href.slice(1));
                        }}
                      >
                        {item.link.label} <LuArrowRight aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
