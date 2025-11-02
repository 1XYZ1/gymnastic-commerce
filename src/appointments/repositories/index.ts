import { gymApi } from '@/api/gymApi';
import { AppointmentApiRepository } from './AppointmentApiRepository';
import { AppointmentMapper } from '../mappers/AppointmentMapper';

/**
 * Instancia singleton del repositorio de citas
 * Inyecta dependencias (API client y mapper)
 */
export const appointmentRepository = new AppointmentApiRepository(gymApi, AppointmentMapper);
