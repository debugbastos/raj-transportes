import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow: string;
  /** Primeira linha, em peso leve. */
  lead: string;
  /** Segunda linha, em peso forte. */
  strong: string;
  id: string;
  children?: ReactNode;
  className?: string;
}

/** Título de seção no padrão da marca: rótulo em faixa, linha leve e linha pesada. */
export function SectionHeading({ eyebrow, lead, strong, id, children, className = "" }: Props) {
  return (
    <div className={`section-heading ${className}`}>
      <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>
      <Reveal as="h2" className="title" id={id} delay={60}>
        <span className="title__lead">{lead}</span>
        <span className="title__strong">{strong}</span>
      </Reveal>
      {children && (
        <Reveal className="section-heading__lede" delay={120}>
          {children}
        </Reveal>
      )}
    </div>
  );
}
