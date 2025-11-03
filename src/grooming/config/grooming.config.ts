/**
 * Configuración del módulo de Grooming
 * Constantes y valores de referencia para el sistema de sesiones de grooming
 */

// Servicios comunes de grooming para sugerencias
export const COMMON_GROOMING_SERVICES = [
  'Baño',
  'Corte',
  'Corte de uñas',
  'Limpieza de oídos',
  'Cepillado',
  'Desenredado',
  'Baño medicado',
  'Vaciado de glándulas',
  'Limpieza dental',
  'Hidratación',
];

// Estilos de corte comunes
export const COMMON_HAIR_STYLES = [
  'Corte verano',
  'Corte estándar',
  'Corte de raza',
  'Rapado completo',
  'Solo tijera',
  'Corte higiénico',
];

// Productos comunes utilizados en sesiones de grooming
export const COMMON_PRODUCTS = [
  'Shampoo hipoalergénico',
  'Shampoo medicado',
  'Acondicionador',
  'Desenredante',
  'Perfume',
  'Talco',
];

// Estados de piel
export const SKIN_CONDITIONS = [
  'Normal',
  'Seca',
  'Grasosa',
  'Irritada',
  'Con parásitos',
  'Heridas',
];

// Estados de pelaje
export const COAT_CONDITIONS = [
  'Excelente',
  'Bueno',
  'Regular',
  'Enredado',
  'Muy enredado',
  'Con nudos',
];

// Opciones de comportamiento durante sesión
export const BEHAVIOR_OPTIONS = [
  'Muy tranquilo',
  'Tranquilo',
  'Normal',
  'Nervioso',
  'Muy nervioso',
  'Agresivo',
];

// Configuración de horarios de grooming
export const GROOMING_HOURS = {
  start: 8,
  end: 20,
  intervalMinutes: 30,
};

// Colores para badges de condición de pelaje
export const COAT_CONDITION_COLORS: Record<string, string> = {
  'Excelente': 'bg-green-100 text-green-800 border-green-200',
  'Bueno': 'bg-blue-100 text-blue-800 border-blue-200',
  'Regular': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Enredado': 'bg-orange-100 text-orange-800 border-orange-200',
  'Muy enredado': 'bg-red-100 text-red-800 border-red-200',
  'Con nudos': 'bg-red-100 text-red-800 border-red-200',
};

// Colores para badges de condición de piel
export const SKIN_CONDITION_COLORS: Record<string, string> = {
  'Normal': 'bg-green-100 text-green-800 border-green-200',
  'Seca': 'bg-blue-100 text-blue-800 border-blue-200',
  'Grasosa': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Irritada': 'bg-orange-100 text-orange-800 border-orange-200',
  'Con parásitos': 'bg-red-100 text-red-800 border-red-200',
  'Heridas': 'bg-red-100 text-red-800 border-red-200',
};

// Colores para badges de comportamiento
export const BEHAVIOR_COLORS: Record<string, string> = {
  'Muy tranquilo': 'bg-green-100 text-green-800 border-green-200',
  'Tranquilo': 'bg-blue-100 text-blue-800 border-blue-200',
  'Normal': 'bg-gray-100 text-gray-800 border-gray-200',
  'Nervioso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Muy nervioso': 'bg-orange-100 text-orange-800 border-orange-200',
  'Agresivo': 'bg-red-100 text-red-800 border-red-200',
};
