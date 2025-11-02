/**
 * Configuración de navegación para el módulo shop
 *
 * Define los links de navegación y utilidades para mapear categorías
 */

export interface NavigationLink {
  readonly path: string;
  readonly label: string;
  readonly category: string | null;
  readonly requiresAuth?: boolean;
}

export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { path: '/', label: 'Todos', category: null },
  { path: '/category/dogs', label: 'Perros', category: 'dogs' },
  { path: '/category/cats', label: 'Gatos', category: 'cats' },
  { path: '/services', label: 'Servicios', category: null },
  { path: '/appointments', label: 'Mis Citas', category: null, requiresAuth: true },
] as const;

/**
 * Obtiene la etiqueta de una categoría
 * @param category - La categoría a buscar
 * @returns La etiqueta de la categoría o 'Productos' si no se encuentra
 */
export const getCategoryLabel = (category: string | null): string => {
  const link = NAVIGATION_LINKS.find((l) => l.category === category);
  return link?.label || 'Productos';
};
