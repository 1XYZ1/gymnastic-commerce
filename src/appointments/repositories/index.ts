import { gymApi } from '@/api/gymApi';
import { AppointmentApiRepository } from './AppointmentApiRepository';
import { AppointmentMapper } from '../mappers/AppointmentMapper';

/**
 * Instancia singleton del repositorio de citas
 * Inyecta dependencias (API client y mapper)
 * Lazy initialization para evitar dependencias circulares
 */
let _appointmentRepository: AppointmentApiRepository | undefined;

const getAppointmentRepository = (): AppointmentApiRepository => {
  if (!_appointmentRepository) {
    _appointmentRepository = new AppointmentApiRepository(gymApi, AppointmentMapper);
  }
  return _appointmentRepository;
};

export const appointmentRepository = getAppointmentRepository();
