import { gymApi } from '@/api/gymApi';
import { ServiceApiRepository } from './ServiceApiRepository';
import { ServiceMapper } from '../mappers/ServiceMapper';

/**
 * Instancia singleton del repositorio de servicios
 * Inyecta las dependencias necesarias (API client y Mapper)
 * Lazy initialization para evitar dependencias circulares
 */
let _serviceRepository: ServiceApiRepository | undefined;

// Exportar función getter para lazy initialization
export const getServiceRepository = (): ServiceApiRepository => {
  if (!_serviceRepository) {
    _serviceRepository = new ServiceApiRepository(gymApi, ServiceMapper);
  }
  return _serviceRepository;
};
