import { gymApi } from '@/api/gymApi';
import { ServiceApiRepository } from './ServiceApiRepository';
import { ServiceMapper } from '../mappers/ServiceMapper';

/**
 * Instancia singleton del repositorio de servicios
 * Inyecta las dependencias necesarias (API client y Mapper)
 */
export const serviceRepository = new ServiceApiRepository(gymApi, ServiceMapper);
