import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ADDRESS_PARTS, type CepState, type QuoteData, type QuoteErrors, type QuoteField, type QuoteStep, type RouteSide, type ServiceName } from "../types";
import { emptyAddress } from "../lib/address";
import { CepNetworkError, fetchCep, formatCep, type CepResult } from "../lib/cep";
import { onlyDigits } from "../lib/phone";
import { firstErrorField, validateStep } from "../lib/validation";
import { scrollToId } from "../lib/scroll";

export const EMPTY_QUOTE: QuoteData = {
  nome: "", tel: "", email: "", empresa: "",
  servico: "", estab: "", tipoCarga: "", outro: "",
  ...emptyAddress("o"),
  ...emptyAddress("d"),
  data: "", desc: "", vol: "", caixas: "", ajuda: "", obs: "",
  consent: false,
};

const IDLE: CepState = { status: "idle" };

/** Campos do endereço que o ViaCEP pode preencher. Número, tipo de imóvel, andar, apartamento e interfone nunca são tocados. */
const AUTO_PARTS = ["Rua", "Comp", "Bairro", "Cid", "UF"] as const;
type AutoPart = (typeof AUTO_PARTS)[number];
const NO_AUTO: Record<AutoPart, string> = { Rua: "", Comp: "", Bairro: "", Cid: "", UF: "" };
/** Pausa na digitação antes da consulta automática. */
const CEP_DEBOUNCE_MS = 450;

interface QuoteApi {
  data: QuoteData;
  errors: QuoteErrors;
  step: QuoteStep;
  maxStep: QuoteStep;
  cep: Record<RouteSide, CepState>;
  setField: <K extends QuoteField>(field: K, value: QuoteData[K]) => void;
  /** Atualiza o CEP (com máscara) e agenda a consulta ao ViaCEP quando ele fica completo. */
  setCep: (side: RouteSide, value: string) => void;
  /** Tenta a consulta de novo (por exemplo, depois de uma falha de rede). */
  retryCep: (side: RouteSide) => void;
  /** Ao sair do campo: consulta se o CEP estiver completo; avisa se estiver incompleto. */
  checkCep: (side: RouteSide) => void;
  /** Consulta manual (botão de busca ou Enter no campo do CEP). */
  lookupCep: (side: RouteSide) => void;
  /** Valida a etapa atual; se estiver ok, avança. Retorna se avançou. */
  next: () => boolean;
  back: () => void;
  goTo: (step: QuoteStep) => void;
  /** Valida todas as etapas; leva o usuário à primeira com erro. */
  validateAll: () => boolean;
  swapRoute: () => void;
  /** Pré-seleciona o serviço a partir de qualquer card ou link da página e leva ao formulário. */
  chooseService: (service: ServiceName) => void;
  openForm: (step?: QuoteStep) => void;
}

const QuoteContext = createContext<QuoteApi | null>(null);

/** Leva o campo ao centro da tela (fora do header fixo) e coloca o foco nele. */
export const focusField = (field: QuoteField | undefined) => {
  if (!field) return;
  requestAnimationFrame(() => {
    const el = document.getElementById(`f-${field}`);
    if (!el) return;
    const box = el.closest(".field, fieldset, .consent") ?? el;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    el.focus({ preventScroll: true });
  });
};

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<QuoteData>(EMPTY_QUOTE);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [step, setStep] = useState<QuoteStep>(1);
  const [maxStep, setMaxStep] = useState<QuoteStep>(1);
  const [cep, setCepState] = useState<Record<RouteSide, CepState>>({ o: IDLE, d: IDLE });

  // Controle das consultas de CEP: uma por lado (origem/destino), independentes.
  const inflight = useRef<Record<RouteSide, AbortController | null>>({ o: null, d: null });
  // CEP (só números) atualmente no campo de cada lado: uma resposta só é aplicada se ainda corresponder a ele.
  const latest = useRef<Record<RouteSide, string>>({ o: "", d: "" });
  // Consulta agendada após uma pequena pausa na digitação.
  const debounce = useRef<Record<RouteSide, number | undefined>>({ o: undefined, d: undefined });
  const cache = useRef(new Map<string, CepResult>());
  // Últimos valores preenchidos pelo ViaCEP em cada lado. Num novo CEP, um campo só é atualizado se estiver vazio
  // ou ainda tiver o valor que veio do CEP anterior: o que o cliente editou à mão é respeitado.
  const autoFilled = useRef<Record<RouteSide, Record<AutoPart, string>>>({ o: { ...NO_AUTO }, d: { ...NO_AUTO } });

  useEffect(() => () => {
    inflight.current.o?.abort();
    inflight.current.d?.abort();
    window.clearTimeout(debounce.current.o);
    window.clearTimeout(debounce.current.d);
  }, []);

  const setField = useCallback(<K extends QuoteField>(field: K, value: QuoteData[K]) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }, []);

  const applyCepResult = useCallback((side: RouteSide, digits: string, result: CepResult) => {
    // Só aplica se este ainda for o CEP do campo (resposta antiga nunca sobrescreve um CEP mais recente).
    if (latest.current[side] !== digits) return;
    if (result.kind === "notfound") {
      // Nenhum dado é inventado nem apagado: o cliente corrige o CEP ou preenche à mão.
      setCepState((s) => ({ ...s, [side]: { status: "notfound", cep: digits } }));
      return;
    }
    const a = result.address;
    const values: Record<AutoPart, string> = { Rua: a.street, Comp: a.complement, Bairro: a.district, Cid: a.city, UF: a.uf };
    const prev = autoFilled.current[side];
    autoFilled.current[side] = values;
    // Cidade e UF pertencem ao CEP: sempre seguem o CEP consultado.
    const always: AutoPart[] = ["Cid", "UF"];
    setData((d) => {
      const next = { ...d } as QuoteData;
      for (const part of AUTO_PARTS) {
        const key = `${side}${part}` as const;
        const current = d[key].trim();
        const value = values[part];
        const untouched = !current || current === prev[part]; // vazio ou ainda com o valor do CEP anterior
        if (always.includes(part) && value) next[key] = value;
        else if (value && untouched) next[key] = value;
        else if (!value && current && current === prev[part]) next[key] = ""; // não deixa dado do CEP antigo
      }
      return next;
    });
    setErrors((e) => {
      const next = { ...e, [`${side}Cep`]: undefined };
      for (const part of AUTO_PARTS) if (values[part]) next[`${side}${part}`] = undefined;
      return next;
    });
    setCepState((s) => ({ ...s, [side]: { status: "found", cep: digits, city: a.city, uf: a.uf } }));
  }, []);

  const lookup = useCallback(
    async (side: RouteSide, digits: string) => {
      window.clearTimeout(debounce.current[side]);
      debounce.current[side] = undefined;
      inflight.current[side]?.abort();
      inflight.current[side] = null;
      latest.current[side] = digits;

      const cached = cache.current.get(digits);
      if (cached) {
        applyCepResult(side, digits, cached);
        return;
      }

      const ctrl = new AbortController();
      inflight.current[side] = ctrl;
      setCepState((s) => ({ ...s, [side]: { status: "loading", cep: digits } }));
      try {
        const result = await fetchCep(digits, ctrl.signal);
        cache.current.set(digits, result);
        applyCepResult(side, digits, result);
      } catch (err) {
        if (ctrl.signal.aborted) return; // substituída por uma consulta mais nova ou CEP alterado
        if (latest.current[side] !== digits) return;
        // Bloqueio do ambiente: política de segurança detectada, ou página embutida (iframe) sem acesso ao ViaCEP.
        const embedded = typeof window !== "undefined" && window.self !== window.top;
        const blocked = err instanceof CepNetworkError && (err.blocked || embedded);
        // Os dados já digitados são preservados; o cliente pode tentar de novo ou preencher à mão.
        setCepState((s) => ({ ...s, [side]: { status: "error", cep: digits, blocked } }));
      } finally {
        if (inflight.current[side] === ctrl) inflight.current[side] = null;
      }
    },
    [applyCepResult],
  );

  const setCep = useCallback(
    (side: RouteSide, value: string) => {
      const masked = formatCep(value);
      const digits = onlyDigits(masked);
      setField(`${side}Cep`, masked);
      window.clearTimeout(debounce.current[side]);
      debounce.current[side] = undefined;
      if (digits === latest.current[side] && digits.length === 8) return; // mesmo CEP: nada a refazer
      // CEP alterado: cancela a consulta anterior e limpa o aviso antigo.
      inflight.current[side]?.abort();
      inflight.current[side] = null;
      latest.current[side] = digits;
      setCepState((s) => (s[side].status === "idle" ? s : { ...s, [side]: IDLE }));
      // Consulta automática após uma pequena pausa na digitação (ou já ao sair do campo).
      if (digits.length === 8) {
        debounce.current[side] = window.setTimeout(() => void lookup(side, digits), CEP_DEBOUNCE_MS);
      }
    },
    [lookup, setField],
  );

  /** Consulta manual (botão de busca ou Enter no campo): consulta já, ou explica o que falta. */
  const lookupCep = useCallback(
    (side: RouteSide) => {
      const digits = latest.current[side];
      if (digits.length === 8) {
        void lookup(side, digits);
        return;
      }
      setErrors((e) => ({
        ...e,
        [`${side}Cep`]: digits.length ? "CEP incompleto. Use os 8 números, no formato 00000-000." : "Informe o CEP para buscar o endereço.",
      }));
    },
    [lookup],
  );

  const retryCep = useCallback(
    (side: RouteSide) => {
      const digits = latest.current[side];
      if (digits.length === 8) {
        cache.current.delete(digits);
        void lookup(side, digits);
      }
    },
    [lookup],
  );

  /** Ao sair do campo: consulta na hora se o CEP estiver completo e ainda não consultado; avisa se estiver incompleto. */
  const checkCep = useCallback(
    (side: RouteSide) => {
      const digits = latest.current[side];
      if (digits.length > 0 && digits.length < 8) {
        setErrors((e) => ({ ...e, [`${side}Cep`]: "CEP incompleto. Use os 8 números, no formato 00000-000." }));
      } else if (digits.length === 8 && debounce.current[side] !== undefined) {
        void lookup(side, digits);
      }
    },
    [lookup],
  );

  const goTo = useCallback((s: QuoteStep) => {
    setStep(s);
    setMaxStep((m) => (s > m ? s : m));
  }, []);

  // Trava curta após avançar: um clique duplo não pula etapas nem valida a etapa seguinte sem querer.
  const advancing = useRef(0);
  const next = useCallback(() => {
    if (Date.now() - advancing.current < 400) return false;
    const e = validateStep(step, data);
    setErrors(e);
    if (Object.keys(e).length) {
      focusField(firstErrorField(e));
      return false;
    }
    if (step < 5) {
      advancing.current = Date.now();
      goTo((step + 1) as QuoteStep);
    }
    return true;
  }, [data, goTo, step]);

  const back = useCallback(() => {
    setErrors({});
    if (step > 1) setStep((step - 1) as QuoteStep);
  }, [step]);

  const validateAll = useCallback(() => {
    for (const s of [1, 2, 3, 4, 5] as QuoteStep[]) {
      const e = validateStep(s, data);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        focusField(firstErrorField(e));
        return false;
      }
    }
    return true;
  }, [data]);

  const swapRoute = useCallback(() => {
    setData((d) => {
      const next = { ...d };
      for (const p of ADDRESS_PARTS) {
        next[`o${p}`] = d[`d${p}`];
        next[`d${p}`] = d[`o${p}`];
      }
      return next;
    });
    autoFilled.current = { o: autoFilled.current.d, d: autoFilled.current.o };
    // Consultas em andamento pertencem ao lado antigo: são canceladas, e o resultado já obtido troca de lado junto com os campos.
    inflight.current.o?.abort();
    inflight.current.d?.abort();
    inflight.current = { o: null, d: null };
    window.clearTimeout(debounce.current.o);
    window.clearTimeout(debounce.current.d);
    debounce.current = { o: undefined, d: undefined };
    const settle = (c: CepState): CepState => (c.status === "loading" ? IDLE : c);
    setCepState((s) => ({ o: settle(s.d), d: settle(s.o) }));
    latest.current = { o: latest.current.d, d: latest.current.o };
    setErrors((e) => {
      const next = { ...e };
      for (const p of ADDRESS_PARTS) {
        delete next[`o${p}`];
        delete next[`d${p}`];
      }
      return next;
    });
  }, []);

  const openForm = useCallback(
    (target?: QuoteStep) => {
      if (target && target <= maxStep) setStep(target);
      scrollToId("orcamento");
    },
    [maxStep],
  );

  const chooseService = useCallback(
    (service: ServiceName) => {
      setField("servico", service);
      scrollToId("orcamento");
    },
    [setField],
  );

  const api = useMemo<QuoteApi>(
    () => ({ data, errors, step, maxStep, cep, setField, setCep, retryCep, checkCep, lookupCep, next, back, goTo, validateAll, swapRoute, chooseService, openForm }),
    [data, errors, step, maxStep, cep, setField, setCep, retryCep, checkCep, lookupCep, next, back, goTo, validateAll, swapRoute, chooseService, openForm],
  );

  return <QuoteContext.Provider value={api}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote precisa estar dentro de <QuoteProvider>.");
  return ctx;
}
