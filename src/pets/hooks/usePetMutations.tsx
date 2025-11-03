import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { petRepository } from '../repositories';
import type { CreatePetDto, UpdatePetDto } from '../types';
import { PetValidationService } from '../services';

export const usePetMutations = () => {
  const queryClient = useQueryClient();

  // Crear mascota
  const createPet = useMutation({
    mutationFn: (data: CreatePetDto) => {
      // Validación previa
      const validation = PetValidationService.validateCreateDto(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
      return petRepository.create(data);
    },
    onSuccess: (newPet) => {
      // Invalidar cache de lista de mascotas
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success(`¡${newPet.name} ha sido registrado exitosamente!`);
    },
    onError: (error: Error) => {
      toast.error(`Error al crear mascota: ${error.message}`);
    },
  });

  // Actualizar mascota
  const updatePet = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetDto }) => {
      return petRepository.update(id, data);
    },
    onSuccess: (updatedPet) => {
      // Invalidar cache de la mascota específica y la lista
      queryClient.invalidateQueries({ queryKey: ['pet', updatedPet.id] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', updatedPet.id] });
      toast.success(`${updatedPet.name} actualizado correctamente`);
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  // Eliminar mascota
  const deletePet = useMutation({
    mutationFn: (id: string) => petRepository.delete(id),
    onSuccess: (result) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.removeQueries({ queryKey: ['pet', result.id] });
      queryClient.removeQueries({ queryKey: ['pet-complete-profile', result.id] });
      toast.success('Mascota eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  return {
    createPet,
    updatePet,
    deletePet,
  };
};
