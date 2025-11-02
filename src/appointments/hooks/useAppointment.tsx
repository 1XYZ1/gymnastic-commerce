import { useQuery } from '@tanstack/react-query';
import { appointmentRepository } from '../repositories';

/**
 * Hook para obtener una cita específica por ID
 * Se habilita solo cuando el ID existe
 */
export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentRepository.getAppointmentById(id),
    enabled: !!id,
  });
};
