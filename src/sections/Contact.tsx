import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { LuArrowRight, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { CopyButton } from "../components/CopyButton";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { COMPANY, LINKS } from "../config/company";
import { useQuote } from "../context/QuoteContext";
import { scrollToId } from "../lib/scroll";
import "./contact.css";

export function Contact() {
  const { openForm } = useQuote();
  return (
    <section className="section contact" id="contato" aria-labelledby="contato-title">
      <div className="container">
        <SectionHeading id="contato-title" eyebrow="Contato" lead="Precisa transportar algo?" strong="Vamos conversar.">
          Entre em contato com a RAJ Transportes, explique sua necessidade e solicite um orçamento para seu frete ou mudança.
        </SectionHeading>

        <div className="contact__grid">
          <Reveal className="contact-card" delay={0}>
            <a className="contact-card__cover" href={LINKS.whatsappHello} target="_blank" rel="noopener noreferrer" aria-label="Abrir conversa no WhatsApp com a RAJ Transportes" />
            <FaWhatsapp className="contact-card__icon contact-card__icon--wa" aria-hidden="true" />
            <span className="contact-card__k">WhatsApp</span>
            <span className="contact-card__v">{COMPANY.phoneDisplay}</span>
            <span className="contact-card__act">Abrir conversa <LuArrowRight aria-hidden="true" /></span>
          </Reveal>
          <Reveal className="contact-card" delay={70}>
            <a className="contact-card__cover" href={LINKS.tel} aria-label={`Ligar para ${COMPANY.phoneDisplay}`} />
            <LuPhone className="contact-card__icon" aria-hidden="true" />
            <span className="contact-card__k">Telefone</span>
            <span className="contact-card__v">{COMPANY.phoneDisplay}</span>
            <span className="contact-card__row">
              <span className="contact-card__act">Ligar <LuArrowRight aria-hidden="true" /></span>
              <CopyButton value={COMPANY.phoneDisplay} label="Copiar número" />
            </span>
          </Reveal>
          <Reveal className="contact-card" delay={140}>
            <a className="contact-card__cover" href={`${LINKS.mail}?subject=${encodeURIComponent("Orçamento - RAJ Transportes")}`} aria-label={`Enviar e-mail para ${COMPANY.email}`} />
            <LuMail className="contact-card__icon" aria-hidden="true" />
            <span className="contact-card__k">E-mail</span>
            <span className="contact-card__v">{COMPANY.email}</span>
            <span className="contact-card__row">
              <span className="contact-card__act">Escrever e-mail <LuArrowRight aria-hidden="true" /></span>
              <CopyButton value={COMPANY.email} label="Copiar e-mail" />
            </span>
          </Reveal>
          <Reveal className="contact-card" delay={210}>
            <a className="contact-card__cover" href="#orcamento" onClick={(e) => { e.preventDefault(); openForm(3); }} aria-label="Informar meu trajeto no formulário de orçamento" />
            <LuMapPin className="contact-card__icon" aria-hidden="true" />
            <span className="contact-card__k">Sede e atendimento</span>
            <span className="contact-card__v">{COMPANY.hq}</span>
            <span className="contact-card__note">Atendimento em todo o Brasil</span>
            <span className="contact-card__act">Informar meu trajeto <LuArrowRight aria-hidden="true" /></span>
          </Reveal>
        </div>

        <Reveal className="contact__cta" delay={120}>
          <a className="btn btn--primary" href="#orcamento" onClick={(e) => { e.preventDefault(); scrollToId("orcamento"); }}>
            Solicitar orçamento <LuArrowRight aria-hidden="true" />
          </a>
          <p>Responsável: <strong>{COMPANY.owner}</strong> · {COMPANY.name}</p>
          <a className="insta-link" href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram da RAJ Transportes: ${COMPANY.instagram} (abre em nova aba)`}>
            <FaInstagram aria-hidden="true" />
            <span>{COMPANY.instagram}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
