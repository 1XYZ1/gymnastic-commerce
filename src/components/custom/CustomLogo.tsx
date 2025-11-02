import { Link } from "react-router";
import { CONTENT } from "@/config/content.config";

interface CustomLogoProps {
  subtitle?: string;
}

export const CustomLogo = ({
  subtitle = CONTENT.logo.defaultSubtitle,
}: CustomLogoProps) => {
  return (
    <Link
      to="/"
      className="flex items-center whitespace-nowrap"
      aria-label="Ir a la página principal"
    >
      <span className="font-montserrat font-bold text-xl">Milo |</span>
      <span className="text-muted-foreground px-2">{subtitle}</span>
    </Link>
  );
};
