import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { usePet } from '@/pets/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PetAvatar, TemperamentBadge, ImageZoomModal } from '@/pets/components';
import { PetAgeCalculatorService } from '@/pets/services';
import { ArrowLeft, Edit, AlertCircle, Loader2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Página de perfil de una mascota (versión simplificada)
 *
 * NOTA: Esta es una versión temporal que usa solo el endpoint básico /pets/:id
 * Cuando el backend implemente /pets/:id/complete-profile, se agregará:
 * - Historial médico completo
 * - Vacunas y alertas
 * - Historial de grooming
 * - Estadísticas y resumen
 */
export function PetProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pet, isLoading, error } = usePet(id);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Cargando perfil de mascota...</span>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12" role="alert">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
          <p className="text-red-600">Error al cargar el perfil de la mascota</p>
          <Button onClick={() => navigate('/pets')} className="mt-4">
            Volver a Mis Mascotas
          </Button>
        </div>
      </div>
    );
  }

  const age = PetAgeCalculatorService.getFormattedAge(pet.birthDate);
  const birthDateFormatted = format(new Date(pet.birthDate), "dd 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
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

        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
          {/* Avatar - Click para ampliar */}
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            onClick={() => setZoomModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setZoomModalOpen(true);
              }
            }}
            aria-label="Ver foto de perfil ampliada"
          >
            <PetAvatar pet={pet} size="lg" />
          </div>

          {/* Pet info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-pet-name">{pet.name}</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 capitalize">
              {pet.breed || pet.species} • {age}
            </p>
            <div className="flex gap-2 mt-3 sm:mt-4 justify-center md:justify-start flex-wrap">
              <TemperamentBadge temperament={pet.temperament} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/pets/${pet.id}/edit`)}
              >
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" aria-hidden="true" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta informativa temporal */}
      <Card className="mb-4 sm:mb-6 border-blue-200 bg-blue-50" role="status">
        <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs sm:text-sm text-blue-900">
              <p className="font-medium mb-1">Vista simplificada</p>
              <p>
                Mostrando información básica de la mascota.
                El historial médico y de grooming estará disponible próximamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        open={zoomModalOpen}
        onClose={() => setZoomModalOpen(false)}
        pet={pet}
      />

      {/* Grid responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Información General */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Especie:</span>
              <span className="font-medium capitalize">{pet.species}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Género:</span>
              <span className="font-medium capitalize">{pet.gender}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Fecha de nacimiento:</span>
              <span className="font-medium text-right">{birthDateFormatted}</span>
            </div>
            {pet.breed && (
              <>
                <Separator />
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Raza:</span>
                  <span className="font-medium text-right">{pet.breed}</span>
                </div>
              </>
            )}
            {pet.weight && (
              <>
                <Separator />
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Peso:</span>
                  <span className="font-medium">{pet.weight} kg</span>
                </div>
              </>
            )}
            {pet.color && (
              <>
                <Separator />
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="font-medium text-right">{pet.color}</span>
                </div>
              </>
            )}
            {pet.microchipNumber && (
              <>
                <Separator />
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Microchip:</span>
                  <span className="font-mono text-[10px] sm:text-xs break-all text-right max-w-[60%]">{pet.microchipNumber}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notas de comportamiento */}
        {pet.behaviorNotes && pet.behaviorNotes.length > 0 && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Notas de Comportamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 sm:space-y-2">
                {pet.behaviorNotes.map((note, index) => (
                  <li key={index} className="text-xs sm:text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5 sm:mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Notas generales */}
        {pet.generalNotes && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Notas Generales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground">{pet.generalNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
