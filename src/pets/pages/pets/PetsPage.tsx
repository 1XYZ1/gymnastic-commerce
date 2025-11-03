import { usePets } from '@/pets/hooks';
import { PetCard } from '@/pets/components';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { Plus, Loader2 } from 'lucide-react';

/**
 * Página que muestra la lista de mascotas del usuario autenticado
 *
 * Funcionalidades:
 * - Lista todas las mascotas del usuario
 * - Permite agregar nueva mascota
 * - Navega al detalle de cada mascota
 * - Maneja estados de carga y error
 */
export function PetsPage() {
  const navigate = useNavigate();
  const { data: pets, isLoading, error } = usePets();

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Cargando mascotas...</span>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar mascotas: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header con título y botón de agregar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mis Mascotas</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Administra los perfiles de tus mascotas
          </p>
        </div>
        <Button onClick={() => navigate('/pets/new')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          <span className="hidden xs:inline">Agregar Mascota</span>
          <span className="xs:hidden">Agregar</span>
        </Button>
      </div>

      {/* Lista de mascotas o estado vacío */}
      {pets && pets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onClick={() => navigate(`/pets/${pet.id}`)}
              onViewProfile={() => navigate(`/pets/${pet.id}/profile`)}
            />
          ))}
        </div>
      ) : (
        // Estado vacío - sin mascotas registradas
        <div className="text-center py-8 sm:py-12 px-4 bg-muted rounded-lg">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Aún no tienes mascotas registradas
          </p>
          <Button onClick={() => navigate('/pets/new')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Agregar Mi Primera Mascota
          </Button>
        </div>
      )}
    </div>
  );
}
