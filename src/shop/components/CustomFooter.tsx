import { Link } from "react-router";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { DEFAULT_FOOTER_SECTIONS, type FooterSection } from "@/config/footer.config";
import { CONTENT } from "@/config/content.config";

interface CustomFooterProps {
  sections?: FooterSection[];
  description?: string;
}

export const CustomFooter = ({
  sections = DEFAULT_FOOTER_SECTIONS,
  description = CONTENT.footer.description,
}: CustomFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-12 px-4 lg:px-8 mt-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <CustomLogo />
            <p className="text-sm text-muted-foreground mt-4">
              {description}
            </p>
          </div>

          {/* Secciones de enlaces dinámicas */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <nav aria-label={section.title}>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      {link.external ? (
                        <a
                          href={link.to}
                          className="hover:text-foreground transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className="hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {CONTENT.footer.companyName}.{" "}
            {CONTENT.footer.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};
