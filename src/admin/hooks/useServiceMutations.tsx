import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getServiceRepository } from '@/services/repositories';
import type { CreateServiceDTO, UpdateServiceDTO } from '../types/service-admin.types';
import type { AxiosErrorResponse } from '@/shared/types';

/**
 * Hook con mutations para operaciones CRUD de servicios en el admin
 * Maneja la invalidación de queries y notificaciones de usuario
 */
export const useServiceMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Mutation para crear un nuevo servicio
   */
  const createService = useMutation({
    mutationFn: (data: CreateServiceDTO) => getServiceRepository().createService(data),
    onSuccess: () => {
      // Invalidar queries de servicios para refrescar los listados
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      toast.success('Servicio creado exitosamente');
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(
        error?.response?.data?.message || 'Error al crear el servicio. Intenta nuevamente.'
      );
    },
  });

  /**
   * Mutation para actualizar un servicio existente
   */
  const updateService = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceDTO }) =>
      getServiceRepository().updateService(id, data),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas al servicio
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['service', variables.id] });
      toast.success('Servicio actualizado exitosamente');
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(
        error?.response?.data?.message || 'Error al actualizar el servicio. Intenta nuevamente.'
      );
    },
  });

  /**
   * Mutation para eliminar un servicio
   */
  const deleteService = useMutation({
    mutationFn: (id: string) => getServiceRepository().deleteService(id),
    onSuccess: () => {
      // Invalidar queries de servicios
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      toast.success('Servicio eliminado exitosamente');
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(
        error?.response?.data?.message || 'Error al eliminar el servicio. Intenta nuevamente.'
      );
    },
  });

  return {
    createService,
    updateService,
    deleteService,
  };
};
