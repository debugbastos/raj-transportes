import logo from "../assets/brand/logo-raj-transportes.png";

interface LogoProps {
  /**
   * "plain": logomarca direto sobre fundo claro (header).
   * "plate": logomarca sobre uma placa branca, para fundos azul-marinho (rodapé).
   * As cores do arquivo oficial nunca são alteradas; por isso, em fundo escuro a logo vai sobre branco.
   */
  variant?: "plain" | "plate";
  className?: string;
  decorative?: boolean;
}

/** A arte oficial já contém o nome "RAJ Transportes", então nenhum texto é repetido ao lado dela. */
export function Logo({ variant = "plain", className = "", decorative = false }: LogoProps) {
  return (
    <span className={`logo logo--${variant} ${className}`}>
      <img src={logo} alt={decorative ? "" : "RAJ Transportes"} width={569} height={180} />
    </span>
  );
}
