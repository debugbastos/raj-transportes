import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { LuCircleCheck } from "react-icons/lu";

const ToastContext = createContext<(message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), 3400);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={`toast${visible ? " is-visible" : ""}`} role="status" aria-live="polite">
        <LuCircleCheck aria-hidden="true" />
        <span>{message}</span>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
