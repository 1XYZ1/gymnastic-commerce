import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { medicalRepository } from '../repositories';
import type { CreateMedicalRecordDto } from '../types/medical.types';
import { MedicalValidationService } from '../services';

/**
 * Hook para mutaciones (create/update/delete) de registros médicos
 * Incluye validaciones de negocio, manejo de errores e invalidación de cache
 */
export const useMedicalMutations = () => {
  const queryClient = useQueryClient();

  // Crear registro médico
  const createMedicalRecord = useMutation({
    mutationFn: (data: CreateMedicalRecordDto) => {
      // Validación previa
      const validation = MedicalValidationService.validateCreateDto(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
      return medicalRepository.create(data);
    },
    onSuccess: (newRecord) => {
      // Invalidar cache del historial médico de la mascota
      if (newRecord.pet?.id) {
        queryClient.invalidateQueries({ queryKey: ['medical-records', newRecord.pet.id] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', newRecord.pet.id] });
      }
      toast.success('Registro médico creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear registro médico: ${error.message}`);
    },
  });

  // Actualizar registro médico
  const updateMedicalRecord = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMedicalRecordDto> }) => {
      return medicalRepository.update(id, data);
    },
    onSuccess: (updatedRecord) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['medical-record', updatedRecord.id] });
      if (updatedRecord.pet?.id) {
        queryClient.invalidateQueries({ queryKey: ['medical-records', updatedRecord.pet.id] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', updatedRecord.pet.id] });
      }
      toast.success('Registro médico actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  // Eliminar registro médico
  const deleteMedicalRecord = useMutation({
    mutationFn: ({ id, petId }: { id: string; petId?: string }) =>
      medicalRepository.delete(id).then((result) => ({ ...result, petId })),
    onSuccess: (result) => {
      // Invalidar cache
      queryClient.removeQueries({ queryKey: ['medical-record', result.id] });
      if (result.petId) {
        queryClient.invalidateQueries({ queryKey: ['medical-records', result.petId] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', result.petId] });
      }
      toast.success('Registro médico eliminado correctamente');
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
