/**
 * Configuración del footer de la aplicación
 *
 * Define la estructura de secciones y enlaces del footer,
 * permitiendo fácil mantenimiento y actualización de las rutas
 */

export interface FooterLink {
  label: string;
  to: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

/**
 * Secciones predeterminadas del footer
 * Cada sección incluye un título y una lista de enlaces con sus rutas
 */
export const DEFAULT_FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Productos",
    links: [
      { label: "Camisetas", to: "/productos/camisetas" },
      { label: "Sudaderas", to: "/productos/sudaderas" },
      { label: "Chaquetas", to: "/productos/chaquetas" },
      { label: "Accesorios", to: "/productos/accesorios" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Contacto", to: "/contacto" },
      { label: "Envíos", to: "/ayuda/envios" },
      { label: "Devoluciones", to: "/ayuda/devoluciones" },
      { label: "Guía de Tallas", to: "/ayuda/tallas" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre Nosotros", to: "/empresa/sobre-nosotros" },
      { label: "Sustentabilidad", to: "/empresa/sustentabilidad" },
      { label: "Carreras", to: "/empresa/carreras" },
      { label: "Prensa", to: "/empresa/prensa" },
    ],
  },
];
