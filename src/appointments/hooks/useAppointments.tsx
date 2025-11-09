import { useQuery } from '@tanstack/react-query';
import { getAppointmentRepository } from '../repositories';
import type { AppointmentFilter } from '../types/appointment.types';
import { APPOINTMENTS_CONFIG } from '../config/appointment.config';

/**
 * Hook para obtener la lista de citas del usuario autenticado
 * Coordina entre React Query y el repositorio
 */
export const useAppointments = (filter?: Partial<AppointmentFilter>) => {
  const fullFilter: AppointmentFilter = {
    limit: filter?.limit ?? APPOINTMENTS_CONFIG.pagination.defaultLimit,
    offset: filter?.offset ?? 0,
    status: filter?.status,
    serviceId: filter?.serviceId,
    dateFrom: filter?.dateFrom,
    dateTo: filter?.dateTo,
  };

  return useQuery({
    queryKey: ['appointments', fullFilter],
    queryFn: () => getAppointmentRepository().getAppointments(fullFilter),
  });
};
