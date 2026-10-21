import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Atraso em milissegundos, para entradas em sequência. */
  delay?: number;
  id?: string;
  style?: CSSProperties;
}

/** Entrada suave ao rolar. Elementos já visíveis na carga aparecem sem animação. */
export function Reveal({ as: Tag = "div", children, className = "", delay = 0, id, style }: RevealProps) {
  const { ref, inView, armed } = useInView<HTMLElement>();
  const state = !armed ? "" : inView ? " reveal is-in" : " reveal";
  return (
    <Tag ref={ref} id={id} className={`${className}${state}`} style={{ ...style, ["--d" as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
