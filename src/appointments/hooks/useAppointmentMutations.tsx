import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { appointmentRepository } from '../repositories';
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from '../types/appointment.types';

/**
 * Hook que expone las mutaciones de citas (crear, actualizar, cancelar)
 * Maneja invalidación de caché y notificaciones toast
 */
export const useAppointmentMutations = () => {
  const queryClient = useQueryClient();

  const createAppointment = useMutation({
    mutationFn: (dto: CreateAppointmentDTO) => appointmentRepository.createAppointment(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita agendada exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error al agendar cita';
      toast.error(errorMessage || 'Error al agendar cita');
    },
  });

  const updateAppointment = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAppointmentDTO }) =>
      appointmentRepository.updateAppointment(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
      toast.success('Cita actualizada exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error al actualizar cita';
      toast.error(errorMessage || 'Error al actualizar cita');
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: (id: string) => appointmentRepository.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
      toast.success('Cita cancelada exitosamente');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error al cancelar cita';
      toast.error(errorMessage || 'Error al cancelar cita');
    },
  });

  return {
    createAppointment,
    updateAppointment,
    cancelAppointment,
  };
};
