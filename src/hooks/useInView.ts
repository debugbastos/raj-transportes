import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Indica quando o elemento entra na tela (uma única vez).
 * Elementos que já estão visíveis na montagem começam como "vistos",
 * então nada que o visitante já está olhando pisca ou some.
 */
export function useInView<T extends Element>(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setInView(true);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, rootMargin]);

  return { ref, inView, armed };
}
