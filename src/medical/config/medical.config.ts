import type { VisitType } from '@/shared/types/enums';

/**
 * Configuración del módulo Medical
 * Labels, colores, constantes y opciones predefinidas
 */

// Labels traducidos para tipos de visita
export const VISIT_TYPE_LABELS: Record<VisitType, string> = {
  consultation: 'Consulta',
  vaccination: 'Vacunación',
  surgery: 'Cirugía',
  emergency: 'Emergencia',
  checkup: 'Chequeo',
  other: 'Otro',
};

// Colores para badges de cada tipo de visita
export const VISIT_TYPE_COLORS: Record<VisitType, string> = {
  consultation: 'bg-blue-100 text-blue-800 border-blue-200',
  vaccination: 'bg-green-100 text-green-800 border-green-200',
  surgery: 'bg-red-100 text-red-800 border-red-200',
  emergency: 'bg-orange-100 text-orange-800 border-orange-200',
  checkup: 'bg-purple-100 text-purple-800 border-purple-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
};

// Vacunas comunes sugeridas
export const COMMON_VACCINES = [
  'Antirrábica',
  'Séxtuple (Canina)',
  'Quíntuple (Canina)',
  'Triple Felina',
  'Leucemia Felina',
  'Bordetella',
  'Leptospirosis',
  'Parvovirus',
  'Giardia',
  'Coronavirus',
];

// Estados de vacunación
export const VACCINATION_STATUS_LABELS = {
  current: 'Al día',
  upcoming: 'Por vencer',
  overdue: 'Vencida',
  'no-due-date': 'Sin fecha',
};

export const VACCINATION_STATUS_COLORS = {
  current: 'bg-green-100 text-green-800 border-green-200',
  upcoming: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
  'no-due-date': 'bg-gray-100 text-gray-800 border-gray-200',
};

// Horarios de atención veterinaria (para validación de citas)
export const VETERINARY_HOURS = {
  start: 8, // 8:00 AM
  end: 20, // 8:00 PM
  intervalMinutes: 30,
};

// Rangos de temperatura normal por especie (opcional para alertas)
export const NORMAL_TEMPERATURE_RANGES = {
  dog: { min: 38.0, max: 39.2 },
  cat: { min: 38.0, max: 39.5 },
  bird: { min: 40.0, max: 42.0 },
  rabbit: { min: 38.5, max: 40.0 },
  hamster: { min: 37.0, max: 38.0 },
  other: { min: 36.0, max: 42.0 },
};
