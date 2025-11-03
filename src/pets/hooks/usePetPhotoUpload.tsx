import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { petRepository } from '../repositories';
import { PetPhotoValidationService } from '../services';

/**
 * Hook para manejar la subida y eliminación de fotos de perfil de mascotas
 *
 * Funcionalidades:
 * - Validación de imágenes (tipo, tamaño, dimensiones, aspect ratio)
 * - Subida de foto al backend
 * - Eliminación de foto
 * - Invalidación automática de cache
 * - Feedback con toast notifications
 */
export const usePetPhotoUpload = () => {
  const queryClient = useQueryClient();

  // Subir/actualizar foto de perfil
  const uploadPhoto = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      // Validación previa
      const validation = await PetPhotoValidationService.validateImage(file);

      if (!validation.valid) {
        throw new Error(validation.errors.join('\n'));
      }

      // Mostrar warnings si existen (no bloquean)
      if (validation.warnings && validation.warnings.length > 0) {
        validation.warnings.forEach((warning) => toast.info(warning));
      }

      // Subir foto
      return petRepository.updatePhoto(id, file);
    },
    onSuccess: (updatedPet) => {
      // Invalidar cache de la mascota específica y la lista
      queryClient.invalidateQueries({ queryKey: ['pet', updatedPet.id] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', updatedPet.id] });
      toast.success(`Foto de ${updatedPet.name} actualizada correctamente`);
    },
    onError: (error: Error) => {
      // Los errores de validación y del backend se muestran aquí
      const errorMessage = error.message || 'Error al subir la foto';
      toast.error(errorMessage, {
        duration: 5000, // Más tiempo para leer mensajes de validación
      });
    },
  });

  // Eliminar foto de perfil
  const deletePhoto = useMutation({
    mutationFn: (id: string) => petRepository.deletePhoto(id),
    onSuccess: (updatedPet) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['pet', updatedPet.id] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pet-complete-profile', updatedPet.id] });
      toast.success(`Foto de ${updatedPet.name} eliminada correctamente`);
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la foto: ${error.message}`);
    },
  });

  return {
    uploadPhoto,
    deletePhoto,
    isUploading: uploadPhoto.isPending,
    isDeleting: deletePhoto.isPending,
  };
};
