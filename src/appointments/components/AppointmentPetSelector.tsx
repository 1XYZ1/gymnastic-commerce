import { useNavigate } from 'react-router';
import { AlertCircle, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePets } from '@/pets/hooks/usePets';
import { cn } from '@/lib/utils';

interface AppointmentPetSelectorProps {
  value: string;
  onChange: (petId: string) => void;
  onPetDataChange?: (petData: { petName: string; petBreed?: string }) => void;
  error?: string;
}

/**
 * Selector de mascotas para el formulario de citas
 * Permite al usuario elegir una de sus mascotas registradas
 * Integrado con React Hook Form a través de Controller
 */
export function AppointmentPetSelector({ value, onChange, onPetDataChange, error }: AppointmentPetSelectorProps) {
  const navigate = useNavigate();
  const { data: pets, isLoading, isError } = usePets({ limit: 100 });

  // Obtener el ícono de la especie
  const getSpeciesIcon = (species: string) => {
    const icons: Record<string, string> = {
      dog: '🐕',
      cat: '🐈',
      bird: '🦜',
      rabbit: '🐰',
      hamster: '🐹',
      other: '🐾',
    };
    return icons[species] || icons.other;
  };

  const handleCreatePet = () => {
    navigate('/pets/new');
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-sm sm:text-base font-semibold">
          Selecciona tu mascota <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
          <div className="animate-spin rounded-full h-7 w-7 sm:h-8 sm:w-8 border-b-2 border-primary mb-2 sm:mb-3" />
          <p className="text-xs sm:text-sm text-muted-foreground">Cargando tus mascotas...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (isError) {
    return (
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-sm sm:text-base font-semibold">
          Selecciona tu mascota <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-4 text-center">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2 sm:mb-3"
            aria-hidden="true"
          >
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
          </div>
          <p className="text-xs sm:text-sm text-destructive font-medium mb-1.5 sm:mb-2">Error al cargar mascotas</p>
          <p className="text-xs text-muted-foreground">
            Por favor, intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  // Sin mascotas registradas
  if (!pets || pets.length === 0) {
    return (
      <div className="space-y-3 sm:space-y-4 rounded-lg border-2 border-dashed p-4 sm:p-6 bg-muted/30">
        <Label className="text-sm sm:text-base font-semibold flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl" aria-hidden="true">🐾</span>
          Selecciona tu mascota
        </Label>

        <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center text-3xl sm:text-4xl mb-3 sm:mb-4"
            aria-hidden="true"
          >
            🐕
          </div>
          <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2">No tienes mascotas registradas</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 max-w-md">
            Para agendar una cita, primero debes registrar a tu mascota en el sistema
          </p>
          <Button
            type="button"
            onClick={handleCreatePet}
            className="gap-1.5 sm:gap-2 w-full sm:w-auto"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            Registrar mi primera mascota
          </Button>
        </div>
      </div>
    );
  }

  // Selector con mascotas disponibles
  return (
    <div className="space-y-3 sm:space-y-4 rounded-lg border-2 border-dashed p-4 sm:p-6 bg-muted/30">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <Label className="text-sm sm:text-base font-semibold flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl" aria-hidden="true">🐾</span>
          Selecciona tu mascota <span className="text-destructive">*</span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCreatePet}
          className="gap-1.5 flex-shrink-0 w-full sm:w-auto text-xs sm:text-sm"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Nueva mascota
        </Button>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(petId) => {
          onChange(petId);
          // Buscar la mascota seleccionada y pasar sus datos
          const selectedPet = pets.find(p => p.id === petId);
          if (selectedPet && onPetDataChange) {
            onPetDataChange({
              petName: selectedPet.name,
              petBreed: selectedPet.breed,
            });
          }
        }}
        className="grid gap-2 sm:gap-3 sm:grid-cols-2"
      >
        {pets.map((pet) => (
          <div key={pet.id}>
            <RadioGroupItem
              value={pet.id}
              id={`pet-${pet.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`pet-${pet.id}`}
              className={cn(
                "flex items-center gap-2 sm:gap-3 rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-all",
                "hover:bg-accent hover:border-primary/50",
                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                error && !value && "border-destructive/50"
              )}
            >
              {/* Avatar o ícono de la mascota */}
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                aria-hidden="true"
              >
                {pet.profilePhoto ? (
                  <img
                    src={pet.profilePhoto}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  getSpeciesIcon(pet.species)
                )}
              </div>

              {/* Información de la mascota */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs sm:text-sm leading-tight truncate">
                  {pet.name}
                </p>
                {pet.breed && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {pet.breed}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 capitalize">
                  {pet.species === 'dog' ? 'Perro' :
                   pet.species === 'cat' ? 'Gato' :
                   pet.species === 'bird' ? 'Ave' :
                   pet.species === 'rabbit' ? 'Conejo' :
                   pet.species === 'hamster' ? 'Hámster' : 'Otro'}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1 mt-2" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Contador de mascotas */}
      <p className="text-xs text-muted-foreground text-center pt-2">
        {pets.length} {pets.length === 1 ? 'mascota registrada' : 'mascotas registradas'}
      </p>
    </div>
  );
}
