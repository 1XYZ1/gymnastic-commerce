/**
 * Configuración centralizada de contenido textual de la aplicación
 *
 * Este archivo centraliza todos los textos estáticos para facilitar
 * su mantenimiento y permitir futuras implementaciones de i18n
 */

export const CONTENT = {
  logo: {
    defaultSubtitle: "SHOP",
  },
  jumbotron: {
    defaultSubtitle: "Ropa y alimentos para tus mascotas",
  },
  footer: {
    companyName: "Milo y sus Amigos",
    description: "Ropa, accesorios y alimentos para tu mascota.",
    copyrightText: "Todos los derechos reservados",
  },
} as const;
