import type { IconType } from "react-icons";
import { LuArrowLeftRight, LuBoxes, LuBuilding2, LuCircleAlert, LuCircleCheck, LuHouse, LuPackage, LuPlus, LuSearch, LuTruck } from "react-icons/lu";
import { SERVICE_OPTIONS, UFS } from "../../config/company";
import { useQuote } from "../../context/QuoteContext";
import { useToast } from "../../context/ToastContext";
import { formatPhone } from "../../lib/phone";
import { todayISO } from "../../lib/validation";
import { isApartment, NO_COMPLEMENT, NO_INTERCOM, PROPERTY_TYPES, SIDE_TITLE } from "../../lib/address";
import type { QuoteField, RouteSide, ServiceName } from "../../types";
import { ErrorText, Field } from "../Field";

/** Liga um input de texto ao estado do formulário. */
function useBind() {
  const { data, setField } = useQuote();
  return (field: Exclude<QuoteField, "consent" | "servico" | "oCep" | "dCep">) => ({
    value: data[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setField(field, e.target.value),
  });
}

const UF_OPTIONS = Object.keys(UFS).sort();
function UfSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className="input" {...props}>
      <option value="">UF</option>
      {UF_OPTIONS.map((uf) => (
        <option key={uf} value={uf}>
          {uf} · {UFS[uf]}
        </option>
      ))}
    </select>
  );
}

export function StepContact() {
  const { data, errors, setField } = useQuote();
  const bind = useBind();
  return (
    <div className="form-grid">
      <Field id="f-nome" label="Nome completo" required error={errors.nome}>
        {(a) => <input className="input" autoComplete="name" {...a} {...bind("nome")} />}
      </Field>
      <Field id="f-tel" label="Telefone ou WhatsApp com DDD" required error={errors.tel} hint="Use o número em que você quer receber o retorno.">
        {(a) => (
          <input
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(00) 00000-0000"
            {...a}
            value={data.tel}
            onChange={(e) => setField("tel", formatPhone(e.target.value))}
          />
        )}
      </Field>
      <div className="form-grid form-grid--2">
        <Field id="f-email" label="E-mail" error={errors.email}>
          {(a) => <input className="input" type="email" autoComplete="email" {...a} {...bind("email")} />}
        </Field>
        <Field id="f-empresa" label="Empresa">
          {(a) => <input className="input" autoComplete="organization" {...a} {...bind("empresa")} />}
        </Field>
      </div>
    </div>
  );
}

const SERVICE_ICONS: Record<ServiceName, IconType> = {
  Frete: LuTruck,
  "Mudança residencial": LuHouse,
  "Mudança comercial": LuBuilding2,
  "Transporte de pequenos volumes": LuPackage,
  "Transporte de grandes volumes": LuBoxes,
  Outro: LuPlus,
};
const SHORT: Partial<Record<ServiceName, string>> = {
  "Transporte de pequenos volumes": "Pequenos volumes",
  "Transporte de grandes volumes": "Grandes volumes",
};

export function StepService() {
  const { data, errors, setField } = useQuote();
  const bind = useBind();
  const s = data.servico;
  return (
    <div className="form-grid">
      <fieldset className="choice-grid" aria-describedby={errors.servico ? "f-servico-error" : undefined}>
        <legend className="legend">
          Tipo de serviço<span className="req" aria-hidden="true"> *</span>
        </legend>
        {SERVICE_OPTIONS.map((opt, i) => {
          const Icon = SERVICE_ICONS[opt];
          return (
            <label className={`choice${s === opt ? " is-checked" : ""}`} key={opt}>
              <input
                type="radio"
                name="servico"
                id={i === 0 ? "f-servico" : undefined}
                value={opt}
                checked={s === opt}
                onChange={() => setField("servico", opt)}
                aria-invalid={errors.servico ? true : undefined}
              />
              <Icon aria-hidden="true" />
              <span>{SHORT[opt] ?? opt}</span>
            </label>
          );
        })}
      </fieldset>
      <ErrorText id="f-servico-error" error={errors.servico} />

      {s === "Mudança comercial" && (
        <Field id="f-estab" label="Tipo de espaço comercial">
          {(a) => <input className="input" placeholder="Ex.: loja, escritório, depósito" {...a} {...bind("estab")} />}
        </Field>
      )}
      {(s === "Frete" || s === "Transporte de pequenos volumes" || s === "Transporte de grandes volumes") && (
        <Field id="f-tipoCarga" label="O que será transportado">
          {(a) => (
            <select className="input" {...a} {...bind("tipoCarga")}>
              <option value="">Selecione</option>
              <option>Móveis</option>
              <option>Caixas</option>
              <option>Mercadorias</option>
              <option>Equipamentos</option>
              <option>Eletrodomésticos</option>
              <option>Itens variados</option>
            </select>
          )}
        </Field>
      )}
      {s === "Outro" && (
        <Field id="f-outro" label="Descreva o serviço" required error={errors.outro}>
          {(a) => <input className="input" {...a} {...bind("outro")} />}
        </Field>
      )}
    </div>
  );
}

function CepStatus({ side }: { side: RouteSide }) {
  const { cep, retryCep } = useQuote();
  const st = cep[side];
  const id = `f-${side}Cep-status`;
  return (
    <p className={`cep-status cep-status--${st.status}`} id={id} aria-live="polite">
      {st.status === "loading" && (
        <>
          <span className="spinner" aria-hidden="true" /> Buscando endereço pelo CEP…
        </>
      )}
      {st.status === "found" && (
        <>
          <LuCircleCheck aria-hidden="true" /> Endereço encontrado ({st.city} — {st.uf}). Confira e complete o número e os demais dados.
        </>
      )}
      {st.status === "notfound" && (
        <>
          <LuCircleAlert aria-hidden="true" /> CEP não encontrado. Confira o número ou preencha o endereço manualmente.
        </>
      )}
      {st.status === "error" && (
        <>
          <LuCircleAlert aria-hidden="true" />{" "}
          {st.blocked
            ? "Esta pré-visualização bloqueia a consulta ao ViaCEP (no site publicado, o endereço é preenchido sozinho). Preencha o endereço manualmente."
            : "Não foi possível consultar o CEP agora. Tente novamente ou preencha o endereço manualmente."}{" "}
          <button type="button" className="text-btn" onClick={() => retryCep(side)}>
            Tentar novamente
          </button>
        </>
      )}
    </p>
  );
}

/** Caixa "não se aplica": grava um texto explícito no campo, em vez de deixá-lo vazio. */
function NotApplicable({ field, text, label }: { field: QuoteField; text: string; label: string }) {
  const { data, setField } = useQuote();
  const checked = data[field] === text;
  return (
    <label className="na-check">
      <input type="checkbox" checked={checked} onChange={(e) => setField(field, e.target.checked ? text : "")} />
      <span>{label}</span>
    </label>
  );
}

function AddressBlock({ side }: { side: RouteSide }) {
  const { data, errors, cep, setCep, setField, checkCep, lookupCep } = useQuote();
  const bind = useBind();
  const k = <P extends string>(part: P) => `${side}${part}` as const;
  const apt = isApartment(data, side);
  const compNa = data[k("Comp")] === NO_COMPLEMENT;
  const intNa = data[k("Interf")] === NO_INTERCOM;
  return (
    <fieldset className="place">
      <legend className="place__title">
        <span className={`dot dot--${side}`} aria-hidden="true" />
        {SIDE_TITLE[side]}
      </legend>
      <div className="addr-grid">
        <Field id={`f-${k("Cep")}`} label="CEP" required error={errors[k("Cep")]} className="span-2">
          {(a) => (
            <div className="cep-input">
              <input
                className="input"
                inputMode="numeric"
                autoComplete={side === "o" ? "shipping postal-code" : "off"}
                placeholder="00000-000"
                {...a}
                aria-describedby={[a["aria-describedby"], `f-${side}Cep-status`].filter(Boolean).join(" ")}
                value={data[k("Cep")]}
                onChange={(e) => setCep(side, e.target.value)}
                onBlur={() => checkCep(side)}
                onKeyDown={(e) => {
                  // Enter no CEP busca o endereço; não avança a etapa.
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    e.stopPropagation();
                    lookupCep(side);
                  }
                }}
              />
              <button
                type="button"
                className="cep-input__btn"
                aria-label={`Buscar endereço pelo CEP de ${side === "o" ? "origem" : "destino"}`}
                title="Buscar endereço pelo CEP"
                disabled={cep[side].status === "loading"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => lookupCep(side)}
              >
                <LuSearch aria-hidden="true" />
              </button>
            </div>
          )}
        </Field>
        <Field id={`f-${k("Rua")}`} label="Rua, avenida ou logradouro" required error={errors[k("Rua")]} className="span-4">
          {(a) => <input className="input" autoComplete="off" {...a} {...bind(k("Rua"))} />}
        </Field>
        <div className="span-6 status-row">
          <CepStatus side={side} />
        </div>

        <Field id={`f-${k("Num")}`} label="Número" required error={errors[k("Num")]} hint="Sem número? Use S/N." className="span-2">
          {(a) => <input className="input" inputMode="text" autoComplete="off" {...a} {...bind(k("Num"))} />}
        </Field>
        <Field id={`f-${k("Comp")}`} label="Complemento" required error={errors[k("Comp")]} className="span-4">
          {(a) => (
            <>
              <input
                className="input"
                placeholder="Ex.: casa dos fundos, bloco B, sala 4"
                {...a}
                {...bind(k("Comp"))}
                readOnly={compNa}
                aria-readonly={compNa || undefined}
              />
              <NotApplicable field={k("Comp")} text={NO_COMPLEMENT} label="Não há complemento (não se aplica)" />
            </>
          )}
        </Field>

        <fieldset className="span-6 pill-group" aria-describedby={errors[k("Tipo")] ? `f-${side}Tipo-error` : undefined}>
          <legend className="legend">
            Tipo de imóvel<span className="req" aria-hidden="true"> *</span>
          </legend>
          {PROPERTY_TYPES.map((t, i) => (
            <label className="pill" key={t}>
              <input
                type="radio"
                name={`${side}-tipo`}
                id={i === 0 ? `f-${side}Tipo` : undefined}
                value={t}
                checked={data[k("Tipo")] === t}
                onChange={() => setField(k("Tipo"), t)}
                aria-invalid={errors[k("Tipo")] ? true : undefined}
              />
              <span>{t}</span>
            </label>
          ))}
        </fieldset>
        <div className="span-6 status-row">
          <ErrorText id={`f-${side}Tipo-error`} error={errors[k("Tipo")]} />
        </div>

        {apt && (
          <div className="span-6 apt-fields">
            <Field id={`f-${k("Andar")}`} label="Andar" required error={errors[k("Andar")]}>
              {(a) => <input className="input" inputMode="numeric" placeholder="Ex.: 3º" {...a} {...bind(k("Andar"))} />}
            </Field>
            <Field id={`f-${k("Apto")}`} label="Nº do apartamento">
              {(a) => <input className="input" inputMode="text" placeholder="Ex.: 302" {...a} {...bind(k("Apto"))} />}
            </Field>
            <Field id={`f-${k("Interf")}`} label="Interfone" required error={errors[k("Interf")]}>
              {(a) => (
                <>
                  <input className="input" inputMode="text" placeholder="Ex.: 302" {...a} {...bind(k("Interf"))} readOnly={intNa} aria-readonly={intNa || undefined} />
                  <NotApplicable field={k("Interf")} text={NO_INTERCOM} label="Não possui interfone" />
                </>
              )}
            </Field>
          </div>
        )}

        <Field id={`f-${k("Bairro")}`} label="Bairro" required error={errors[k("Bairro")]} className="span-6">
          {(a) => <input className="input" autoComplete="off" {...a} {...bind(k("Bairro"))} />}
        </Field>
        <Field id={`f-${k("Cid")}`} label="Cidade" required error={errors[k("Cid")]} className="span-4">
          {(a) => <input className="input" {...a} {...bind(k("Cid"))} />}
        </Field>
        <Field id={`f-${k("UF")}`} label="Estado (UF)" required error={errors[k("UF")]} className="span-2">
          {(a) => <UfSelect {...a} {...bind(k("UF"))} />}
        </Field>
      </div>
    </fieldset>
  );
}

export function StepRoute() {
  const { swapRoute } = useQuote();
  const toast = useToast();
  return (
    <div className="form-grid">
      <p className="hint route-intro">
        Preencha o CEP para buscar rua, bairro, cidade e estado. Todos os campos podem ser corrigidos. Só o número do apartamento é opcional.
      </p>
      <AddressBlock side="o" />
      <button
        type="button"
        className="swap"
        onClick={() => {
          swapRoute();
          toast("Origem e destino invertidos.");
        }}
      >
        <LuArrowLeftRight aria-hidden="true" /> Inverter origem e destino
      </button>
      <AddressBlock side="d" />
    </div>
  );
}

export function StepCargo() {
  const { data, errors, setField } = useQuote();
  const bind = useBind();
  return (
    <div className="form-grid">
      <Field id="f-desc" label="Descrição dos itens ou da carga" required error={errors.desc}>
        {(a) => <textarea className="input" rows={4} placeholder="Ex.: geladeira, fogão, sofá de 3 lugares, cama de casal e cerca de 20 caixas" {...a} {...bind("desc")} />}
      </Field>
      <div className="form-grid form-grid--2">
        <Field id="f-vol" label="Volume aproximado">
          {(a) => (
            <select className="input" {...a} {...bind("vol")}>
              <option value="">Selecione</option>
              <option>Poucos itens</option>
              <option>Equivalente a 1 cômodo</option>
              <option>Equivalente a 2 ou 3 cômodos</option>
              <option>Casa ou escritório inteiro</option>
              <option>Não sei estimar</option>
            </select>
          )}
        </Field>
        <Field id="f-caixas" label="Quantidade de caixas">
          {(a) => <input className="input" type="number" min={0} inputMode="numeric" {...a} {...bind("caixas")} />}
        </Field>
      </div>
      <Field id="f-data" label="Data desejada" error={errors.data} hint="Ainda não sabe? Deixe em branco e combine com a equipe.">
        {(a) => <input className="input" type="date" min={todayISO()} {...a} {...bind("data")} />}
      </Field>
      <fieldset className="pill-group">
        <legend className="legend">
          Precisa de ajuda para carregar ou descarregar?<span className="opt"> (opcional)</span>
        </legend>
        {["Sim", "Não", "A combinar"].map((v) => (
          <label className="pill" key={v}>
            <input type="radio" name="ajuda" value={v} checked={data.ajuda === v} onChange={() => setField("ajuda", v)} />
            <span>{v}</span>
          </label>
        ))}
      </fieldset>
      <Field id="f-obs" label="Informações adicionais">
        {(a) => <textarea className="input" rows={3} placeholder="Itens frágeis, horários, restrições de acesso…" {...a} {...bind("obs")} />}
      </Field>
    </div>
  );
}
