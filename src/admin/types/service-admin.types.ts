import type { ServiceType } from '@/services/types/service.types';

/**
 * Estructura del formulario de servicio en el admin
 */
export interface ServiceFormInputs {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  type: ServiceType;
  image?: string;
  isActive: boolean;
}

/**
 * DTO para crear un nuevo servicio
 */
export interface CreateServiceDTO {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  type: ServiceType;
  image?: string;
}

/**
 * DTO para actualizar un servicio existente
 */
export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  price?: number;
  durationMinutes?: number;
  type?: ServiceType;
  image?: string;
  isActive?: boolean;
}
