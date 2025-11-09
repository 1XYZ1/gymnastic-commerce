import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMedicalRepository } from '../repositories';
import type { CreateMedicalRecordDto } from '../types/medical.types';
import { MedicalValidationService } from '../services';

/**
 * Hook para mutaciones (create/update/delete) de registros m�dicos
 * Incluye validaciones de negocio, manejo de errores e invalidaci�n de cache
 */
export const useMedicalMutations = () => {
  const queryClient = useQueryClient();

  // Crear registro m�dico
  const createMedicalRecord = useMutation({
    mutationFn: (data: CreateMedicalRecordDto) => {
      // Validaci�n previa
      const validation = MedicalValidationService.validateCreateDto(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
      return getMedicalRepository().create(data);
    },
    onSuccess: (newRecord) => {
      // Invalidar cache del historial m�dico de la mascota
      if (newRecord.pet?.id) {
        queryClient.invalidateQueries({ queryKey: ['medical-records', newRecord.pet.id] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', newRecord.pet.id] });
      }
      toast.success('Registro m�dico creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear registro m�dico: ${error.message}`);
    },
  });

  // Actualizar registro m�dico
  const updateMedicalRecord = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMedicalRecordDto> }) => {
      return getMedicalRepository().update(id, data);
    },
    onSuccess: (updatedRecord) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['medical-record', updatedRecord.id] });
      if (updatedRecord.pet?.id) {
        queryClient.invalidateQueries({ queryKey: ['medical-records', updatedRecord.pet.id] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', updatedRecord.pet.id] });
      }
      toast.success('Registro m�dico actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  // Eliminar registro m�dico
  const deleteMedicalRecord = useMutation({
    mutationFn: ({ id, petId }: { id: string; petId?: string }) =>
      getMedicalRepository().delete(id).then((result) => ({ ...result, petId })),
    onSuccess: (result) => {
      // Invalidar cache
      queryClient.removeQueries({ queryKey: ['medical-record', result.id] });
      if (result.petId) {
        queryClient.invalidateQueries({ queryKey: ['medical-records', result.petId] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', result.petId] });
      }
      toast.success('Registro m�dico eliminado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  return {
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
  };
};
