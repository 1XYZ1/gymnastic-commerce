import { useParams, useNavigate } from 'react-router';
import { useRef } from 'react';
import { usePet, usePetMutations, usePetPhotoUpload } from '@/pets/hooks';
import { PetForm, PetAvatar } from '@/pets/components';
import { PetPhotoValidationService } from '@/pets/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Loader2, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import type { UpdatePetDto } from '@/pets/types';
import type { PetFormData } from '@/pets/config';

/**
 * Página de edición de mascota
 * Permite actualizar los datos de una mascota existente
 */
export function EditPetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pet, isLoading, error } = usePet(id);
  const { updatePet } = usePetMutations();
  const { uploadPhoto, deletePhoto, isUploading, isDeleting } = usePetPhotoUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (formData: PetFormData) => {
    if (!id) return;

    try {
      // Transformar PetFormData a UpdatePetDto
      const updateData: UpdatePetDto = {
        name: formData.name,
        breed: formData.breed ?? undefined,
        color: formData.color ?? undefined,
        weight: formData.weight ?? undefined,
        microchipNumber: formData.microchipNumber ?? undefined,
        temperament: formData.temperament ?? undefined,
        behaviorNotes: formData.behaviorNotes?.filter((note): note is string => note !== undefined),
        generalNotes: formData.generalNotes ?? undefined,
      };

      await updatePet.mutateAsync({ id, data: updateData });
      navigate(`/pets/${id}`);
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/pets/${id}`);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && id) {
      // Validación (solo tipo y tamaño)
      const validation = await PetPhotoValidationService.validateImage(file);
      if (!validation.valid) {
        toast.error(validation.errors.join('\n'));
        event.target.value = '';
        return;
      }

      // Subir imagen directamente
      uploadPhoto.mutate({ id, file });
      event.target.value = '';
    }
  };

  const handleDeletePhoto = () => {
    if (id && pet?.profilePhoto) {
      deletePhoto.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error al cargar la mascota</p>
          <Button onClick={() => navigate('/pets')} className="mt-4">
            Volver a Mis Mascotas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/pets/${id}`)}
          className="mb-3 sm:mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden xs:inline">Volver al Perfil</span>
          <span className="xs:hidden">Volver</span>
        </Button>

        <h1 className="text-2xl sm:text-3xl font-bold">Editar Mascota</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Actualiza la información de {pet.name}
        </p>
      </div>

      {/* Foto de Perfil Card */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Foto de Perfil</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            {/* Avatar with edit/delete buttons */}
            <div className="relative group">
              <PetAvatar pet={pet} size="lg" />

              {/* Upload button overlay */}
              <button
                onClick={handlePhotoClick}
                disabled={isUploading || isDeleting}
                className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-200 ${
                  isUploading || isDeleting
                    ? 'bg-black/70 cursor-wait'
                    : 'bg-black/0 group-hover:bg-black/50 cursor-pointer'
                } disabled:cursor-not-allowed`}
                aria-label="Cambiar foto de perfil"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
                    <span className="text-xs sm:text-sm font-medium">Subiendo...</span>
                  </div>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-2 text-white">
                    <Camera className="h-6 w-6 sm:h-8 sm:w-8" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:block">Cambiar foto</span>
                  </div>
                )}
              </button>

              {/* Delete button - only show if pet has a photo */}
              {pet.profilePhoto && !isUploading && !isDeleting && (
                <button
                  onClick={handleDeletePhoto}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 sm:p-2 shadow-lg transition-all duration-200"
                  aria-label="Eliminar foto de perfil"
                  title="Eliminar foto"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading || isDeleting}
                className="sr-only"
                aria-label="Seleccionar foto de perfil"
              />
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">
              Haz clic en la foto para cambiarla. La imagen se subirá automáticamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Información de la Mascota</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <PetForm
            initialData={pet}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updatePet.isPending}
            submitLabel="Guardar Cambios"
          />
        </CardContent>
      </Card>
    </div>
  );
}
