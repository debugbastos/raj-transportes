import { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { LuCopy, LuExternalLink } from "react-icons/lu";
import { COMPANY } from "../../config/company";
import { usePrivacy } from "../../context/PrivacyContext";
import { useQuote } from "../../context/QuoteContext";
import { useToast } from "../../context/ToastContext";
import { addressLines } from "../../lib/address";
import { buildQuoteMessage, formatDateBR, serviceExtras, whatsappUrl } from "../../lib/whatsapp";
import type { QuoteStep } from "../../types";
import { copyText } from "../CopyButton";
import { ErrorText } from "../Field";

export function StepReview() {
  const { data, errors, setField, goTo, validateAll } = useQuote();
  const openPrivacy = usePrivacy();
  const toast = useToast();
  const [opened, setOpened] = useState(false);
  const message = useMemo(() => buildQuoteMessage(data), [data]);
  const href = whatsappUrl(message);
  const x = serviceExtras(data);

  const groups: { title: string; step: QuoteStep; rows: [string, string][] }[] = [
    { title: "Seus dados", step: 1, rows: [["Nome", data.nome], ["Telefone", data.tel], ["E-mail", data.email], ["Empresa", data.empresa]] },
    { title: "Serviço", step: 2, rows: [["Tipo", data.servico], ["Descrição", x.outro], ["Espaço", x.estab], ["Carga", x.tipoCarga]] },
    { title: "Origem — coleta", step: 3, rows: addressLines(data, "o") },
    { title: "Destino — entrega", step: 3, rows: addressLines(data, "d") },
    {
      title: "Carga e data",
      step: 4,
      rows: [["Data desejada", formatDateBR(data.data) || "A combinar"], ["Descrição", data.desc], ["Volume", data.vol], ["Caixas", data.caixas], ["Ajuda", data.ajuda], ["Observações", data.obs]],
    },
  ];

  return (
    <div className="form-grid">
      <div className="review">
        {groups.map((g) => (
          <div className="review__group" key={g.title}>
            <div className="review__head">
              <span>{g.title}</span>
              <button type="button" onClick={() => goTo(g.step)}>Editar</button>
            </div>
            <dl>
              {g.rows
                .filter(([, v]) => v && v.trim() && v.trim() !== "/")
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
        ))}
      </div>

      <label className={`consent${errors.consent ? " has-error" : ""}`}>
        <input
          type="checkbox"
          id="f-consent"
          checked={data.consent}
          onChange={(e) => setField("consent", e.target.checked)}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? "f-consent-error" : undefined}
        />
        <span>
          Concordo que meus dados sejam usados para responder a esta solicitação, conforme a{" "}
          <button type="button" className="text-btn" onClick={openPrivacy}>política de privacidade</button>.<span className="req" aria-hidden="true"> *</span>
        </span>
      </label>
      <ErrorText id="f-consent-error" error={errors.consent} />

      <a
        className="btn btn--wa btn--block btn--lg"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!validateAll()) {
            e.preventDefault();
            return;
          }
          setOpened(true);
        }}
      >
        <FaWhatsapp aria-hidden="true" /> Solicitar orçamento pelo WhatsApp
      </a>
      <p className="hint hint--center">O WhatsApp abre com a mensagem pronta. O pedido só chega à RAJ Transportes quando você tocar em enviar na conversa.</p>

      {opened && (
        <div className="sent" role="status">
          <p><strong>WhatsApp aberto em uma nova aba.</strong> Confira a mensagem e toque em enviar para concluir sua solicitação.</p>
          <p className="hint">Não abriu? Copie a mensagem e envie para {COMPANY.phoneDisplay}.</p>
          <pre className="sent__msg">{message}</pre>
          <div className="sent__actions">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={async () => toast((await copyText(message)) ? "Mensagem copiada. Cole no WhatsApp da RAJ Transportes." : "Não foi possível copiar. Selecione o texto da mensagem.")}
            >
              <LuCopy aria-hidden="true" /> Copiar mensagem
            </button>
            <a className="btn btn--outline btn--sm" href={href} target="_blank" rel="noopener noreferrer">
              <LuExternalLink aria-hidden="true" /> Abrir o WhatsApp de novo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
