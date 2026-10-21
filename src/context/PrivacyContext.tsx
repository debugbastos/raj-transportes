import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { LuX } from "react-icons/lu";
import { COMPANY, LINKS } from "../config/company";
import { useLockScroll } from "../hooks/useScrollState";

const PrivacyContext = createContext<() => void>(() => {});
export const usePrivacy = () => useContext(PrivacyContext);

/** Política de privacidade real, aberta em um dialog nativo a partir de qualquer link da página. */
export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const back = useRef<HTMLElement | null>(null);
  useLockScroll(open);

  const show = useCallback(() => {
    back.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal?.();
    if (!open && d.open) {
      d.close();
      back.current?.focus?.({ preventScroll: true });
    }
  }, [open]);

  return (
    <PrivacyContext.Provider value={show}>
      {children}
      <dialog
        ref={ref}
        className="modal"
        aria-labelledby="privacy-title"
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <div className="modal__body">
          <button type="button" className="round-btn round-btn--light modal__close" onClick={() => setOpen(false)} aria-label="Fechar política de privacidade">
            <LuX aria-hidden="true" />
          </button>
          <h2 id="privacy-title">Política de privacidade</h2>
          <p>Esta política explica como a RAJ Transportes trata as informações informadas neste site.</p>
          <h3>Quais dados</h3>
          <p>Somente os dados que você digita no formulário de orçamento: nome, telefone, e-mail e empresa (se informados), tipo de serviço, endereços de coleta e entrega, data desejada e detalhes da carga.</p>
          <h3>Para que são usados</h3>
          <p>Para montar a mensagem de solicitação de orçamento e permitir que a RAJ Transportes responda ao seu pedido. Os dados não são usados para outra finalidade.</p>
          <h3>Como são enviados</h3>
          <p>Este site não envia nem guarda seus dados em servidores, planilhas ou bancos de dados. As informações ficam apenas na página aberta no seu aparelho. Elas só chegam à RAJ Transportes se você enviar a mensagem pelo WhatsApp, que é um serviço de terceiros com política de privacidade própria.</p>
          <h3>Consulta de CEP</h3>
          <p>Quando você digita um CEP no formulário, somente esse CEP é consultado no ViaCEP, um serviço público de endereços, para preencher a cidade e o estado. Nenhum outro dado seu é enviado nessa consulta.</p>
          <h3>Seus direitos</h3>
          <p>
            Você pode pedir a consulta, correção ou exclusão dos dados enviados pelo WhatsApp a qualquer momento, pelo telefone {COMPANY.phoneDisplay} ou pelo e-mail <a href={LINKS.mail}>{COMPANY.email}</a>.
          </p>
          <button type="button" className="btn btn--primary" onClick={() => setOpen(false)}>Entendi</button>
        </div>
      </dialog>
    </PrivacyContext.Provider>
  );
}
