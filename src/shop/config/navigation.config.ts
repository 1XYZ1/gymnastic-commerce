/**
 * Configuración de navegación para el módulo shop
 *
 * Define los links de navegación y utilidades para mapear géneros
 */

export interface NavigationLink {
  readonly path: string;
  readonly label: string;
  readonly gender: string | null;
}

export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { path: '/', label: 'Todos', gender: null },
  { path: '/gender/men', label: 'Hombres', gender: 'men' },
  { path: '/gender/women', label: 'Mujeres', gender: 'women' },
  { path: '/gender/kid', label: 'Niños', gender: 'kid' },
] as const;

/**
 * Obtiene la etiqueta de un género
 * @param gender - El género a buscar
 * @returns La etiqueta del género o 'Productos' si no se encuentra
 */
export const getGenderLabel = (gender: string | null): string => {
  const link = NAVIGATION_LINKS.find((l) => l.gender === gender);
  return link?.label || 'Productos';
};
