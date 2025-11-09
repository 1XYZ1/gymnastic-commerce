import type { AxiosInstance } from 'axios';
import type { IServiceRepository } from './IServiceRepository';
import type { Service, ServiceFilter, ServicesResponse } from '../types/service.types';
import type { CreateServiceDTO, UpdateServiceDTO } from '@/admin/types/service-admin.types';
import type { ServicesApiResponse } from '@/shared/types';
import { ServiceMapper } from '../mappers/ServiceMapper';

/**
 * Interface para respuesta individual del servicio desde el backend
 * Mapea directamente los campos que devuelve la API
 */
interface ServiceApiResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  type: 'GROOMING' | 'VETERINARY' | string; // Aceptar string para flexibilidad
  image?: string;
  isActive: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Implementación del repositorio de servicios usando la API REST
 */
export class ServiceApiRepository implements IServiceRepository {
  private api: AxiosInstance;
  private mapper: typeof ServiceMapper;

  constructor(api: AxiosInstance, mapper: typeof ServiceMapper) {
    this.api = api;
    this.mapper = mapper;
  }

  /**
   * Obtiene servicios paginados desde la API
   */
  async getServices(filter: ServiceFilter): Promise<ServicesResponse> {
    const { data } = await this.api.get<ServicesApiResponse>('/services', {
      params: {
        limit: filter.limit,
        offset: filter.offset,
        type: filter.type,
      },
    });
    return this.mapper.toDomainList(data);
  }

  /**
   * Obtiene un servicio específico por ID desde la API
   */
  async getServiceById(id: string): Promise<Service> {
    const { data } = await this.api.get<ServiceApiResponse>(`/services/${id}`);
    // Validamos que tenga la estructura esperada antes de mapear
    if (!this.isValidServiceResponse(data)) {
      throw new Error('Invalid service response from API');
    }
    // Type assertion seguro después de validación runtime
    return this.mapper.toDomain(data as any);
  }

  /**
   * Crea un nuevo servicio (ADMIN)
   */
  async createService(serviceData: CreateServiceDTO): Promise<Service> {
    const { data } = await this.api.post<ServiceApiResponse>('/services', serviceData);
    // Validamos que tenga la estructura esperada antes de mapear
    if (!this.isValidServiceResponse(data)) {
      throw new Error('Invalid service response from API');
    }
    // Type assertion seguro después de validación runtime
    return this.mapper.toDomain(data as any);
  }

  /**
   * Actualiza un servicio existente (ADMIN)
   */
  async updateService(id: string, serviceData: UpdateServiceDTO): Promise<Service> {
    const { data } = await this.api.patch<ServiceApiResponse>(`/services/${id}`, serviceData);
    // Validamos que tenga la estructura esperada antes de mapear
    if (!this.isValidServiceResponse(data)) {
      throw new Error('Invalid service response from API');
    }
    // Type assertion seguro después de validación runtime
    return this.mapper.toDomain(data as any);
  }

  /**
   * Validación runtime para asegurar que la respuesta tiene la estructura esperada
   */
  private isValidServiceResponse(data: unknown): data is ServiceApiResponse {
    if (!data || typeof data !== 'object') return false;

    const service = data as Record<string, unknown>;

    return (
      typeof service.id === 'string' &&
      typeof service.name === 'string' &&
      typeof service.description === 'string' &&
      typeof service.price === 'number' &&
      typeof service.durationMinutes === 'number' &&
      typeof service.type === 'string' &&
      typeof service.isActive === 'boolean' &&
      typeof service.user === 'object' &&
      service.user !== null
    );
  }

  /**
   * Elimina un servicio (ADMIN)
   */
  async deleteService(id: string): Promise<void> {
    await this.api.delete(`/services/${id}`);
  }
}
