import { useQuery } from '@tanstack/react-query';
import { appointmentRepository } from '@/appointments/repositories';
import type { AppointmentFilter } from '@/appointments/types/appointment.types';
import { APPOINTMENTS_CONFIG } from '@/appointments/config/appointment.config';

/**
 * Hook para que admins obtengan todas las citas del sistema
 * Similar a useAppointments pero sin restricción de usuario
 */
export const useAdminAppointments = (filter?: Partial<AppointmentFilter>) => {
  const fullFilter: AppointmentFilter = {
    limit: filter?.limit ?? APPOINTMENTS_CONFIG.pagination.defaultLimit,
    offset: filter?.offset ?? 0,
    status: filter?.status,
    serviceId: filter?.serviceId,
    dateFrom: filter?.dateFrom,
    dateTo: filter?.dateTo,
  };

  return useQuery({
    queryKey: ['admin-appointments', fullFilter],
    queryFn: () => appointmentRepository.getAppointments(fullFilter),
  });
};
