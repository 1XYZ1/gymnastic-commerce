import type { AxiosInstance } from 'axios';
import type { IServiceRepository } from './IServiceRepository';
import type { Service, ServiceFilter, ServicesResponse } from '../types/service.types';
import type { CreateServiceDTO, UpdateServiceDTO } from '@/admin/types/service-admin.types';
import { ServiceMapper } from '../mappers/ServiceMapper';

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
    const { data } = await this.api.get<any>('/services', {
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
    const { data } = await this.api.get<any>(`/services/${id}`);
    return this.mapper.toDomain(data);
  }

  /**
   * Crea un nuevo servicio (ADMIN)
   */
  async createService(serviceData: CreateServiceDTO): Promise<Service> {
    const { data } = await this.api.post<any>('/services', serviceData);
    return this.mapper.toDomain(data);
  }

  /**
   * Actualiza un servicio existente (ADMIN)
   */
  async updateService(id: string, serviceData: UpdateServiceDTO): Promise<Service> {
    const { data } = await this.api.patch<any>(`/services/${id}`, serviceData);
    return this.mapper.toDomain(data);
  }

  /**
   * Elimina un servicio (ADMIN)
   */
  async deleteService(id: string): Promise<void> {
    await this.api.delete(`/services/${id}`);
  }
}
