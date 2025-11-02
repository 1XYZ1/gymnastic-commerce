import type { ServiceType } from '../types/service.types';

/**
 * Etiquetas legibles para los tipos de servicio
 */
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  grooming: '🐕 Peluquería',
  veterinary: '⚕️ Veterinaria',
};

/**
 * Configuración general del módulo de servicios
 */
export const SERVICES_CONFIG = {
  pagination: {
    defaultLimit: 10,
    defaultPage: 1,
  },
} as const;
