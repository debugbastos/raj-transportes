import { FaWhatsapp } from "react-icons/fa6";
import { LuArrowDown, LuClipboardList, LuShieldCheck } from "react-icons/lu";
import { QuoteForm } from "../components/quote/QuoteForm";
import { Reveal } from "../components/Reveal";
import { LINKS } from "../config/company";
import { usePrivacy } from "../context/PrivacyContext";
import "./quote.css";

/** Leva ao formulário e coloca o cursor no primeiro campo da etapa atual. */
function startForm() {
  const card = document.querySelector<HTMLElement>(".quote-card");
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  card?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => card?.querySelector<HTMLElement>(".quote-step input, .quote-step select, .quote-step textarea")?.focus({ preventScroll: true }), reduce ? 0 : 450);
}

export function Quote() {
  const openPrivacy = usePrivacy();
  return (
    <section className="section section--mist quote" id="orcamento" aria-labelledby="orcamento-title">
      <div className="container quote__grid">
        <div className="quote__head">
          <div className="section-heading">
            <Reveal as="p" className="eyebrow">Orçamento</Reveal>
            <Reveal as="h2" className="title" id="orcamento-title" delay={60}>
              <span className="title__lead">Como solicitar</span>
              <span className="title__strong">um orçamento?</span>
            </Reveal>
            <Reveal as="p" className="section-heading__lede" delay={120}>
              Você pode preencher o formulário abaixo para informar os detalhes do seu frete ou mudança e solicitar um orçamento personalizado. Se preferir, também pode falar diretamente com nossa equipe pelo WhatsApp para tirar dúvidas ou explicar o que precisa.
            </Reveal>
          </div>

          <Reveal className="paths" delay={160}>
            <div className="path">
              <span className="path__n" aria-hidden="true">1</span>
              <div>
                <p className="path__title">Orçamento detalhado</p>
                <p className="path__text">Cinco etapas rápidas, sem cadastro. A mensagem sai pronta para o WhatsApp.</p>
              </div>
              <button type="button" className="btn btn--primary" onClick={startForm}>
                Solicitar orçamento <LuArrowDown aria-hidden="true" />
              </button>
            </div>
            <div className="path">
              <span className="path__n" aria-hidden="true">2</span>
              <div>
                <p className="path__title">Só uma dúvida?</p>
                <p className="path__text">Fale direto com a equipe, sem preencher o formulário.</p>
              </div>
              <a className="btn btn--wa" href={LINKS.whatsappHello} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp aria-hidden="true" /> Tirar dúvidas pelo WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        <div className="quote__form">
          <QuoteForm />
        </div>

        <div className="quote__info">
          <ul className="quote__points">
            <li>
              <LuClipboardList aria-hidden="true" />
              <div><strong>Você pode voltar e corrigir</strong><span>Os dados ficam guardados enquanto você navega entre as etapas.</span></div>
            </li>
            <li>
              <LuShieldCheck aria-hidden="true" />
              <div>
                <strong>Seus dados</strong>
                <span>Usados apenas para responder à sua solicitação. <button type="button" className="text-btn" onClick={openPrivacy}>Ler a política de privacidade</button></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
