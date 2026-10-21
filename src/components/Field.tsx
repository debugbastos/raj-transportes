import type { ReactNode } from "react";
import { LuCircleAlert } from "react-icons/lu";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: (a11y: { id: string; "aria-invalid"?: true; "aria-describedby"?: string; "aria-required"?: true }) => ReactNode;
  className?: string;
}

/** Rótulo, controle, dica e mensagem de erro textual ligados por id. */
export function Field({ id, label, required, error, hint, children, className = "" }: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`field ${error ? "has-error" : ""} ${className}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="req" aria-hidden="true"> *</span> : <span className="opt"> (opcional)</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": required ? true : undefined })}
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="error" id={`${id}-error`}>
          <LuCircleAlert aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p className="error" id={id}>
      <LuCircleAlert aria-hidden="true" />
      {error}
    </p>
  );
}
