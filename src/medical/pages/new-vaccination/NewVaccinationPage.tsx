import { useParams, useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePet } from '@/pets/hooks';
import { useVaccinationMutations } from '@/medical/hooks';
import { VaccinationForm } from '@/medical/components';
import type { CreateVaccinationDto } from '@/medical/types';

export function NewVaccinationPage() {
  const { petId: paramPetId } = useParams<{ petId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // petId puede venir de params o de query string
  const petId = paramPetId || searchParams.get('petId') || undefined;

  const { data: pet, isLoading: isPetLoading } = usePet(petId);
  const { createVaccination } = useVaccinationMutations();

  const handleSubmit = (data: CreateVaccinationDto) => {
    createVaccination.mutate(data, {
      onSuccess: () => {
        // Navegar al historial médico de la mascota, tab vacunas
        if (petId) {
          navigate(`/pets/${petId}/medical`);
        } else {
          navigate('/pets');
        }
      },
    });
  };

  const handleCancel = () => {
    if (petId) {
      navigate(`/pets/${petId}/medical`);
    } else {
      navigate('/pets');
    }
  };

  if (!petId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">No se especificó la mascota</p>
          <Button onClick={() => navigate('/pets')} className="mt-4">
            Volver a Mis Mascotas
          </Button>
        </div>
      </div>
    );
  }

  if (isPetLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">No se encontró la mascota</p>
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
      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" onClick={handleCancel} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al historial
        </Button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Registrar Vacuna</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Nueva vacuna para {pet.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Información de la Vacuna</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <VaccinationForm
            petId={petId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createVaccination.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
