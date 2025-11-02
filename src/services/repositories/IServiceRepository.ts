import type { Service, ServiceFilter, ServicesResponse } from '../types/service.types';
import type { CreateServiceDTO, UpdateServiceDTO } from '@/admin/types/service-admin.types';

/**
 * Interfaz del repositorio de servicios (Dependency Inversion)
 * Define el contrato para el acceso a datos de servicios
 */
export interface IServiceRepository {
  /**
   * Obtiene una lista paginada de servicios con filtros opcionales
   */
  getServices(filter: ServiceFilter): Promise<ServicesResponse>;

  /**
   * Obtiene un servicio específico por su ID
   */
  getServiceById(id: string): Promise<Service>;

  /**
   * Crea un nuevo servicio (ADMIN)
   */
  createService(data: CreateServiceDTO): Promise<Service>;

  /**
   * Actualiza un servicio existente (ADMIN)
   */
  updateService(id: string, data: UpdateServiceDTO): Promise<Service>;

  /**
   * Elimina un servicio (ADMIN)
   */
  deleteService(id: string): Promise<void>;
}
