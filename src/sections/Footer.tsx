import { FaInstagram } from "react-icons/fa6";
import { LuArrowUp, LuMapPin } from "react-icons/lu";
import { Logo } from "../components/Logo";
import { COMPANY, LINKS, NAV, SERVICES } from "../config/company";
import { usePrivacy } from "../context/PrivacyContext";
import { useQuote } from "../context/QuoteContext";
import { scrollToId } from "../lib/scroll";
import type { ServiceName } from "../types";
import "./footer.css";

const EXTRA_SERVICE: { label: string; service: ServiceName } = { label: "Pequenos volumes", service: "Transporte de pequenos volumes" };

export function Footer() {
  const openPrivacy = usePrivacy();
  const { chooseService } = useQuote();
  const year = new Date().getFullYear();
  const to = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };
  const services = [...SERVICES.map((s) => ({ label: s.title, service: s.service })), EXTRA_SERVICE];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#inicio" onClick={to("inicio")} aria-label="RAJ Transportes, voltar ao início">
              <Logo variant="plate" />
            </a>
            <p>RAJ Transportes — Fretes e mudanças com compromisso e excelência em cada entrega.</p>
            <p className="footer__hq"><LuMapPin aria-hidden="true" /> Sede: {COMPANY.hq} · Atendimento em todo o Brasil</p>
            <p className="footer__motto">{COMPANY.motto}</p>
            <a className="footer__insta" href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram da RAJ Transportes: ${COMPANY.instagram} (abre em nova aba)`}>
              <FaInstagram aria-hidden="true" />
              <span>{COMPANY.instagram}</span>
            </a>
          </div>
          <nav className="footer__col" aria-label="Navegação do rodapé">
            <h2>Navegação</h2>
            <ul>
              {NAV.filter((n) => n.id !== "contato").map((n) => (
                <li key={n.id}><a href={`#${n.id}`} onClick={to(n.id)}>{n.label}</a></li>
              ))}
              <li><a href="#faq" onClick={to("faq")}>Dúvidas frequentes</a></li>
            </ul>
          </nav>
          <div className="footer__col">
            <h2>Serviços</h2>
            <ul>
              {services.map((s) => (
                <li key={s.label}>
                  <a href="#orcamento" onClick={(e) => { e.preventDefault(); chooseService(s.service); }}>{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h2>Contato</h2>
            <ul>
              <li><a href={LINKS.whatsappHello} target="_blank" rel="noopener noreferrer">WhatsApp {COMPANY.phoneDisplay}</a></li>
              <li><a href={LINKS.tel}>Ligar {COMPANY.phoneDisplay}</a></li>
              <li><a href={LINKS.mail}>{COMPANY.email}</a></li>
              <li><a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${COMPANY.instagram} (abre em nova aba)`}>Instagram {COMPANY.instagram}</a></li>
              <li><a href="#sede" onClick={to("sede")}>Sede em {COMPANY.hq}</a></li>
              <li><a href="#orcamento" onClick={to("orcamento")}>Solicitar orçamento</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {year} {COMPANY.name}. Todos os direitos reservados.</span>
          <span className="footer__links">
            <button type="button" onClick={openPrivacy}>Política de privacidade</button>
            <a href="#inicio" onClick={to("inicio")}>Voltar ao topo <LuArrowUp aria-hidden="true" /></a>
          </span>
        </div>
      </div>
    </footer>
  );
}
