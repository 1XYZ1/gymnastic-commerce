import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getGroomingRepository } from '../repositories';
import type { CreateGroomingRecordDto, GroomingRecord } from '../types/grooming.types';
import { GroomingValidationService } from '../services';

/**
 * Hook para mutaciones (create/update/delete) de registros de grooming
 * Incluye validaciones de negocio, manejo de errores e invalidación de cache
 */
export const useGroomingMutations = () => {
  const queryClient = useQueryClient();

  // Crear registro de grooming
  const createGroomingRecord = useMutation<GroomingRecord, Error, CreateGroomingRecordDto>({
    mutationFn: (data: CreateGroomingRecordDto) => {
      // Validación previa con servicio de validación
      const validation = GroomingValidationService.validateCreateDto(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
      return getGroomingRepository().create(data);
    },
    onSuccess: (newRecord) => {
      // Invalidar cache del historial de grooming de la mascota
      const petId = newRecord.pet?.id;
      if (petId) {
        queryClient.invalidateQueries({ queryKey: ['grooming-records', petId] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', petId] });
      }
      toast.success('Sesión de grooming registrada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al registrar sesión: ${error.message}`);
    },
  });

  // Actualizar registro de grooming
  const updateGroomingRecord = useMutation<
    GroomingRecord,
    Error,
    { id: string; data: Partial<CreateGroomingRecordDto> }
  >({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGroomingRecordDto> }) => {
      return getGroomingRepository().update(id, data);
    },
    onSuccess: (updatedRecord) => {
      // Invalidar cache del registro actualizado y del historial
      queryClient.invalidateQueries({ queryKey: ['grooming-record', updatedRecord.id] });
      const petId = updatedRecord.pet?.id;
      if (petId) {
        queryClient.invalidateQueries({ queryKey: ['grooming-records', petId] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', petId] });
      }
      toast.success('Registro de grooming actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  // Eliminar registro de grooming
  const deleteGroomingRecord = useMutation<
    { message: string; id: string; petId?: string },
    Error,
    { id: string; petId?: string }
  >({
    mutationFn: ({ id, petId }: { id: string; petId?: string }) =>
      getGroomingRepository().delete(id).then((result: { message: string; id: string }) => ({ ...result, petId })),
    onSuccess: (result) => {
      // Remover del cache el registro eliminado
      queryClient.removeQueries({ queryKey: ['grooming-record', result.id] });
      // Invalidar historial de grooming de la mascota
      if (result.petId) {
        queryClient.invalidateQueries({ queryKey: ['grooming-records', result.petId] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', result.petId] });
      }
      toast.success('Registro de grooming eliminado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  return {
    createGroomingRecord,
    updateGroomingRecord,
    deleteGroomingRecord,
  };
};
