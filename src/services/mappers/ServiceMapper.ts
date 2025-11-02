import type { Service, ServicesResponse } from '../types/service.types';

/**
 * Mapper para transformar datos de la API a entidades de dominio
 */
export class ServiceMapper {
  private static readonly baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  /**
   * Transforma un servicio de la API al modelo de dominio
   * Agrega la URL base a la imagen del servicio
   */
  static toDomain(apiService: any): Service {
    return {
      id: apiService.id,
      name: apiService.name,
      description: apiService.description,
      price: apiService.price,
      durationMinutes: apiService.durationMinutes,
      type: apiService.type,
      image: apiService.image ? `${this.baseUrl}/files/service/${apiService.image}` : undefined,
      isActive: apiService.isActive,
      user: apiService.user,
      createdAt: apiService.createdAt,
      updatedAt: apiService.updatedAt,
    };
  }

  /**
   * Transforma una respuesta paginada de la API al modelo de dominio
   */
  static toDomainList(apiResponse: any): ServicesResponse {
    // El backend devuelve { services: [...], total, limit, offset, pages }
    // Pero nosotros usamos { data: [...], total, limit, offset }
    return {
      data: (apiResponse.services || apiResponse.data || []).map((item: any) => this.toDomain(item)),
      total: apiResponse.total ?? 0,
      limit: apiResponse.limit ?? 10,
      offset: apiResponse.offset ?? 0,
    };
  }
}
