import { useEffect, useRef, useState } from "react";
import { LuArrowRight, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { COMPANY, MOBILE_NAV, NAV } from "../config/company";
import { useActiveSection, useLockScroll, useScrolled } from "../hooks/useScrollState";
import { scrollToId } from "../lib/scroll";
import { Logo } from "./Logo";
import "./header.css";

const SECTION_ALIAS = { "como-funciona": "servicos", sede: "frota", orcamento: "contato", faq: "contato" };

export function Header() {
  const scrolled = useScrolled(8);
  const active = useActiveSection(NAV.map((n) => n.id), SECTION_ALIAS);
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  useLockScroll(open);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burger.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 1040 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className={`site-header${scrolled || open ? " is-solid" : " is-overlay"}`}>
        <div className="container site-header__bar">
          <a className="site-header__brand" href="#inicio" onClick={go("inicio")} aria-label="RAJ Transportes, voltar ao início">
            <Logo />
          </a>
          <nav className="site-nav" aria-label="Navegação principal">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} className={active === n.id ? "is-active" : undefined} aria-current={active === n.id ? "true" : undefined}>
                {n.label}
              </a>
            ))}
          </nav>
          <a className="btn btn--primary btn--sm site-header__cta" href="#orcamento" onClick={go("orcamento")}>
            Solicitar orçamento
          </a>
          <button
            ref={burger}
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="Menu" className="mobile-menu__nav">
          {MOBILE_NAV.map((n, i) => (
            <a key={n.id} ref={i === 0 ? firstLink : undefined} href={`#${n.id}`} onClick={go(n.id)} style={{ ["--i" as string]: i }}>
              {n.label}
              <LuArrowRight aria-hidden="true" />
            </a>
          ))}
        </nav>
        <a className="btn btn--primary btn--block" href="#orcamento" onClick={go("orcamento")}>
          Solicitar orçamento <LuArrowRight aria-hidden="true" />
        </a>
        <div className="mobile-menu__contact">
          <span><LuPhone aria-hidden="true" /> {COMPANY.phoneDisplay}</span>
          <span><LuMail aria-hidden="true" /> {COMPANY.email}</span>
          <span><LuMapPin aria-hidden="true" /> Sede: {COMPANY.hq}</span>
        </div>
      </div>
    </>
  );
}
