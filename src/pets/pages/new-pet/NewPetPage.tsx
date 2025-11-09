import { PetForm } from '@/pets/components';
import { usePetMutations } from '@/pets/hooks';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CreatePetDto } from '@/pets/types';
import type { PetFormData } from '@/pets/config';

/**
 * Página para crear una nueva mascota
 *
 * Funcionalidades:
 * - Muestra formulario de creación de mascota
 * - Maneja el envío del formulario
 * - Navega al perfil de la mascota creada
 * - Permite cancelar y volver a la lista
 */
export function NewPetPage() {
  const navigate = useNavigate();
  const { createPet } = usePetMutations();

  /**
   * Maneja el envío del formulario de creación
   * - Transforma los datos del formulario al DTO de creación
   * - Llama a la mutación de creación
   * - Si tiene éxito, navega al perfil de la nueva mascota
   * - Los errores se manejan con toasts (en el hook)
   */
  const handleSubmit = async (formData: PetFormData) => {
    try {
      // Transformar PetFormData a CreatePetDto
      // (peso null se convierte a undefined)
      const createData: CreatePetDto = {
        name: formData.name,
        species: formData.species as CreatePetDto['species'],
        breed: formData.breed ?? undefined,
        birthDate: formData.birthDate,
        gender: formData.gender as CreatePetDto['gender'],
        color: formData.color ?? undefined,
        weight: formData.weight ?? undefined,
        microchipNumber: formData.microchipNumber ?? undefined,
        temperament: formData.temperament ?? undefined,
        behaviorNotes: formData.behaviorNotes?.filter((note): note is string => note !== undefined),
        generalNotes: formData.generalNotes ?? undefined,
      };

      const newPet = await createPet.mutateAsync(createData);
      // Navegar al perfil de la mascota recién creada
      navigate(`/pets/${newPet.id}`);
    } catch (error) {
      // El error ya se muestra en toast (manejado en el hook)
      console.error('Error creating pet:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      {/* Header con botón de volver */}
      <div className="mb-6 sm:mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/pets')}
          className="mb-3 sm:mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          <span className="hidden xs:inline">Volver a Mis Mascotas</span>
          <span className="xs:hidden">Volver</span>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Agregar Nueva Mascota</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Completa la información de tu mascota
        </p>
      </div>

      {/* Formulario de creación */}
      <div className="bg-card rounded-lg border p-4 sm:p-6">
        <PetForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/pets')}
          isLoading={createPet.isPending}
        />
      </div>
    </div>
  );
}
