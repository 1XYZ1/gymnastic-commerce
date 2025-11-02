import type { User } from '@/shared/types';

/**
 * Tipo de servicio disponible en la plataforma
 */
export type ServiceType = 'grooming' | 'veterinary';

/**
 * Entidad de dominio que representa un servicio veterinario o de peluquería
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  type: ServiceType;
  image?: string;
  isActive: boolean;
  user: User;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filtros para la consulta de servicios
 */
export interface ServiceFilter {
  limit: number;
  offset: number;
  type?: ServiceType;
}

/**
 * Respuesta paginada del listado de servicios
 */
export interface ServicesResponse {
  data: Service[];
  total: number;
  limit: number;
  offset: number;
}
