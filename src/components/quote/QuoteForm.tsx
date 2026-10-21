import { useEffect, useRef } from "react";
import { LuArrowLeft, LuArrowRight, LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import logo from "../../assets/brand/logo-raj-transportes.png";
import { focusField, useQuote } from "../../context/QuoteContext";
import { errorFields, fieldLabel } from "../../lib/validation";
import type { QuoteStep } from "../../types";
import { StepReview } from "./QuoteReview";
import { StepCargo, StepContact, StepRoute, StepService } from "./QuoteSteps";
import "./quote-form.css";

const STEPS: { n: QuoteStep; short: string; title: string }[] = [
  { n: 1, short: "Dados", title: "Seus dados" },
  { n: 2, short: "Serviço", title: "Tipo de serviço" },
  { n: 3, short: "Trajeto", title: "Origem e destino" },
  { n: 4, short: "Carga", title: "Detalhes do transporte" },
  { n: 5, short: "Revisão", title: "Revise e envie" },
];

export function QuoteForm() {
  const { step, maxStep, next, back, goTo, data, errors } = useQuote();
  const pending = errorFields(errors);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const current = STEPS[step - 1];

  // Ao trocar de etapa, leva o foco ao título (leitores de tela anunciam a nova etapa)
  // e garante que o topo do cartão esteja visível no celular.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    titleRef.current?.focus({ preventScroll: true });
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 60 || top > window.innerHeight * 0.6) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  return (
    <div className="quote-card" ref={cardRef}>
      <div className="quote-card__head">
        <img src={logo} alt="" width={569} height={180} />
        <div>
          <p className="quote-card__title">Solicitar orçamento</p>
          <p className="quote-card__sub">RAJ Transportes · resposta pelo WhatsApp</p>
        </div>
      </div>

      {data.servico && (
        <p className="selected" aria-live="polite" key={data.servico}>
          <LuCircleCheck aria-hidden="true" /> Serviço: <strong>{data.servico}</strong>
          {step !== 2 && (
            <button type="button" onClick={() => goTo(2)}>trocar</button>
          )}
        </p>
      )}

      <ol className="stepper" aria-label="Etapas do formulário">
        {STEPS.map((s) => (
          <li key={s.n} className={s.n === step ? "is-current" : s.n < step ? "is-done" : ""}>
            <button type="button" disabled={s.n > maxStep} aria-current={s.n === step ? "step" : undefined} onClick={() => (s.n <= step ? goTo(s.n) : next() && goTo(s.n))}>
              <span className="stepper__bar" />
              <span className="stepper__label">
                <span className="stepper__n">{s.n}</span> {s.short}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/*
        O avanço não depende do envio nativo do <form>: em páginas exibidas dentro de iframes com
        sandbox sem "allow-forms" (como a pré-visualização publicada), o navegador cancela o envio
        antes do evento submit, e o botão parecia não funcionar. Por isso "Continuar" é type="button"
        com onClick, e Enter nos campos é tratado aqui. O onSubmit só impede recarregar a página.
      */}
      <form
        noValidate
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          const t = e.target as HTMLElement;
          if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
          if (t instanceof HTMLInputElement && !["checkbox", "radio", "button", "submit"].includes(t.type)) {
            e.preventDefault();
            if (step < 5) next();
          }
        }}
      >
        <h3 className="quote-step__title" ref={titleRef} tabIndex={-1}>
          {current.title}
        </h3>
        <p className="quote-step__sub">
          Etapa {step} de 5 · {step < 5 ? "Campos com * são obrigatórios." : "Confira tudo antes de enviar."}
        </p>

        <div className="quote-step" key={step}>
          {step === 1 && <StepContact />}
          {step === 2 && <StepService />}
          {step === 3 && <StepRoute />}
          {step === 4 && <StepCargo />}
          {step === 5 && <StepReview />}
        </div>

        {pending.length > 0 && (
          <div className="quote-pending" role="alert" id="quote-pending">
            <p className="quote-pending__title">
              <LuCircleAlert aria-hidden="true" />
              {pending.length === 1 ? "Corrija 1 campo para continuar:" : `Corrija ${pending.length} campos para continuar:`}
            </p>
            <ul>
              {pending.map((f) => (
                <li key={f}>
                  <button type="button" onClick={() => focusField(f)}>
                    <strong>{fieldLabel(f)}</strong> — {errors[f]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="quote-nav">
          {step > 1 ? (
            <button type="button" className="btn btn--ghost" onClick={back}>
              <LuArrowLeft aria-hidden="true" /> Voltar
            </button>
          ) : (
            <span />
          )}
          {step < 5 && (
            <button type="button" className="btn btn--primary" onClick={() => next()} aria-describedby={pending.length ? "quote-pending" : undefined}>
              Continuar <LuArrowRight aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
