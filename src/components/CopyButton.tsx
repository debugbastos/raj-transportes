import { LuCopy } from "react-icons/lu";
import { useToast } from "../context/ToastContext";

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* segue para o retorno false */
  }
  return false;
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      className="chip-btn"
      onClick={async (e) => {
        e.stopPropagation();
        const ok = await copyText(value);
        toast(ok ? `Copiado: ${value}` : `Não foi possível copiar. Anote: ${value}`);
      }}
    >
      <LuCopy aria-hidden="true" />
      {label}
    </button>
  );
}
