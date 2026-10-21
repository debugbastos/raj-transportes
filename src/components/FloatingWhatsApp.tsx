import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { LINKS } from "../config/company";

/**
 * Atalho fixo e verde para o WhatsApp.
 * Fica oculto enquanto estiverem na tela: os botões do hero (que já têm um botão de WhatsApp),
 * o formulário de orçamento e a barra final do rodapé, para nunca cobrir botões ou campos.
 */
const WATCH = [".hero__ctas", "#orcamento", ".footer__bottom"];

export function FloatingWhatsApp() {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const targets = WATCH.map((s) => document.querySelector(s)).filter((el): el is Element => !!el);
    if (!targets.length || typeof IntersectionObserver === "undefined") {
      setHidden(false);
      return;
    }
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setHidden(visible.size > 0);
      },
      { rootMargin: "0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return (
    <a
      className={`fab${hidden ? " is-hidden" : ""}`}
      href={LINKS.whatsappHello}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a RAJ Transportes pelo WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <FaWhatsapp aria-hidden="true" />
      <span className="fab__tip">Fale com a RAJ Transportes</span>
    </a>
  );
}
