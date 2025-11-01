/**
 * Configuración centralizada de contenido textual de la aplicación
 *
 * Este archivo centraliza todos los textos estáticos para facilitar
 * su mantenimiento y permitir futuras implementaciones de i18n
 */

export const CONTENT = {
  logo: {
    defaultSubtitle: "STORE",
  },
  jumbotron: {
    defaultSubtitle: "Ropa minimalista y elegante. Calidad premium para un estilo atemporal.",
  },
  footer: {
    companyName: "Gymnastic Style",
    description: "Ropa inspirada en el diseño minimalista y la innovación de Ropa deportiva.",
    copyrightText: "Todos los derechos reservados",
  },
} as const;
