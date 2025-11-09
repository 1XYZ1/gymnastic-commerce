import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMedicalRepository } from '../repositories';
import type { CreateVaccinationDto } from '../types/medical.types';
import { MedicalValidationService } from '../services';

/**
 * Hook para mutaciones (create/update/delete) de vacunas
 * Incluye validaciones de negocio, manejo de errores e invalidaci�n de cache
 */
export const useVaccinationMutations = () => {
  const queryClient = useQueryClient();

  // Crear vacuna
  const createVaccination = useMutation({
    mutationFn: (data: CreateVaccinationDto) => {
      // Validaci�n previa
      const validation = MedicalValidationService.validateVaccinationDto(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
      return getMedicalRepository().createVaccination(data);
    },
    onSuccess: (newVaccine) => {
      // Invalidar cache de vacunas de la mascota
      if (newVaccine.pet?.id) {
        queryClient.invalidateQueries({ queryKey: ['vaccinations', newVaccine.pet.id] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', newVaccine.pet.id] });
      }
      // Invalidar lista de vacunas pr�ximas a vencer (admin)
      queryClient.invalidateQueries({ queryKey: ['vaccinations-due'] });
      toast.success(`Vacuna "${newVaccine.vaccineName}" registrada exitosamente`);
    },
    onError: (error: Error) => {
      toast.error(`Error al registrar vacuna: ${error.message}`);
    },
  });

  // Actualizar vacuna
  const updateVaccination = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVaccinationDto> }) => {
      return getMedicalRepository().updateVaccination(id, data);
    },
    onSuccess: (updatedVaccine) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['vaccination', updatedVaccine.id] });
      if (updatedVaccine.pet?.id) {
        queryClient.invalidateQueries({ queryKey: ['vaccinations', updatedVaccine.pet.id] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', updatedVaccine.pet.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['vaccinations-due'] });
      toast.success('Vacuna actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar vacuna: ${error.message}`);
    },
  });

  // Eliminar vacuna
  const deleteVaccination = useMutation({
    mutationFn: ({ id, petId }: { id: string; petId?: string }) =>
      getMedicalRepository().deleteVaccination(id).then((result) => ({ ...result, petId })),
    onSuccess: (result) => {
      // Invalidar cache
      queryClient.removeQueries({ queryKey: ['vaccination', result.id] });
      if (result.petId) {
        queryClient.invalidateQueries({ queryKey: ['vaccinations', result.petId] });
        queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', result.petId] });
      }
      queryClient.invalidateQueries({ queryKey: ['vaccinations-due'] });
      toast.success('Vacuna eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar vacuna: ${error.message}`);
    },
  });

  return {
    createVaccination,
    updateVaccination,
    deleteVaccination,
  };
};
