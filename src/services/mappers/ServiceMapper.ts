import type { Service, ServicesResponse, ServiceType } from '../types/service.types';
import type { ServicesApiResponse } from '@/shared/types';
import type { User } from '@/shared/types';
import { buildServiceImageUrl } from '@/shared/utils';

/**
 * Estructura de un servicio en formato API
 * Usa el tipo del schema Zod que es más flexible
 */
interface ServiceApiData {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  type: 'grooming' | 'medical' | 'veterinary'; // Acepta los 3 valores del backend
  image?: string;
  isActive: boolean;
  user: User;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mapper para transformar datos de la API a entidades de dominio
 */
export class ServiceMapper {
  /**
   * Transforma un servicio de la API al modelo de dominio
   * Agrega la URL base a la imagen del servicio usando utilidades compartidas
   * Normaliza 'medical' y 'veterinary' a 'veterinary'
   */
  static toDomain(apiService: ServiceApiData): Service {
    // Normalizar 'medical' a 'veterinary' para compatibilidad
    const normalizedType: ServiceType = apiService.type === 'medical' ? 'veterinary' : apiService.type as ServiceType;

    return {
      id: apiService.id,
      name: apiService.name,
      description: apiService.description,
      price: apiService.price,
      durationMinutes: apiService.durationMinutes,
      type: normalizedType,
      image: apiService.image ? buildServiceImageUrl(apiService.image) : undefined,
      isActive: apiService.isActive,
      user: apiService.user,
      createdAt: apiService.createdAt,
      updatedAt: apiService.updatedAt,
    };
  }

  /**
   * Transforma una respuesta paginada de la API al modelo de dominio
   */
  static toDomainList(apiResponse: ServicesApiResponse): ServicesResponse {
    // El backend devuelve { services: [...], total, limit, offset, pages }
    // Pero nosotros usamos { data: [...], total, limit, offset }
    const items = (apiResponse.services || apiResponse.data || []) as ServiceApiData[];

    return {
      data: items.map((item) => this.toDomain(item)),
      total: apiResponse.total ?? 0,
      limit: apiResponse.limit ?? 10,
      offset: apiResponse.offset ?? 0,
    };
  }
}
