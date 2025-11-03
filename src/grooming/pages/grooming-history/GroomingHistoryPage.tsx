import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Loader2, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePet } from '@/pets/hooks';
import { useGroomingRecords } from '@/grooming/hooks';
import {
  GroomingRecordCard,
  GroomingStatsCard,
  PopularServicesChart,
} from '@/grooming/components';
import { GroomingStatsService } from '@/grooming/services';

export function GroomingHistoryPage() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();

  const { data: pet, isLoading: isPetLoading } = usePet(petId);
  const {
    data: groomingRecords,
    isLoading: isRecordsLoading,
    error: recordsError,
  } = useGroomingRecords(petId);

  const handleBackToProfile = () => {
    if (petId) {
      navigate(`/pets/${petId}`);
    } else {
      navigate('/pets');
    }
  };

  // Ordenar registros por fecha descendente
  const sortedRecords = groomingRecords
    ? GroomingStatsService.sortByDate(groomingRecords, 'desc')
    : [];

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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Button variant="ghost" onClick={handleBackToProfile} className="mb-4">
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
          Volver al perfil
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Historial de Grooming</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Sesiones de grooming de {pet.name}
            </p>
          </div>
          <Button onClick={() => navigate(`/pets/${petId}/grooming/new`)} className="w-full sm:w-auto">
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
            Registrar Sesión
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      {groomingRecords && groomingRecords.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <GroomingStatsCard records={groomingRecords} />
        </div>
      )}

      {/* Servicios Más Comunes */}
      {groomingRecords && groomingRecords.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <PopularServicesChart records={groomingRecords} />
        </div>
      )}

      {/* Lista de Registros */}
      {isRecordsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : recordsError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-900">
                <p className="font-medium">Error al cargar registros de grooming</p>
                <p className="mt-1">{recordsError.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : sortedRecords.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No hay sesiones de grooming registradas para {pet.name}
            </p>
            <Button onClick={() => navigate(`/pets/${petId}/grooming/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar primera sesión
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-semibold">
              Sesiones Registradas ({sortedRecords.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {sortedRecords.map((record) => (
              <GroomingRecordCard
                key={record.id}
                record={record}
                onClick={() => navigate(`/grooming-records/${record.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
