import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Loader2, AlertCircle, Plus, Syringe, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePet } from '@/pets/hooks';
import { useMedicalRecords, useVaccinations } from '@/medical/hooks';
import {
  MedicalRecordCard,
  VaccinationCard,
  VaccinationAlert,
} from '@/medical/components';
import { VaccinationService } from '@/medical/services';

export function MedicalHistoryPage() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('records');

  const { data: pet, isLoading: isPetLoading } = usePet(petId);
  const {
    data: medicalRecords,
    isLoading: isRecordsLoading,
    error: recordsError,
  } = useMedicalRecords(petId);
  const {
    data: vaccinations,
    isLoading: isVaccinationsLoading,
    error: vaccinationsError,
  } = useVaccinations(petId);

  const handleBackToProfile = () => {
    if (petId) {
      navigate(`/pets/${petId}`);
    } else {
      navigate('/pets');
    }
  };

  const handleViewAllVaccinations = () => {
    setActiveTab('vaccinations');
  };

  const sortedRecords = medicalRecords
    ? [...medicalRecords].sort((a, b) => {
        const dateA = new Date(a.visitDate);
        const dateB = new Date(b.visitDate);
        return dateB.getTime() - dateA.getTime();
      })
    : [];

  const sortedVaccinations = vaccinations
    ? VaccinationService.sortByDueDate(vaccinations)
    : [];

  if (isPetLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Cargando información de la mascota...</span>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12" role="alert">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
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
      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" onClick={handleBackToProfile} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Volver al perfil
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Historial Médico</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Registros médicos y vacunas de {pet.name}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
          <TabsTrigger value="records" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Registros Médicos</span>
            <span className="sm:hidden">Registros</span>
            {sortedRecords.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                {sortedRecords.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Syringe className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Vacunas</span>
            <span className="sm:hidden">Vacunas</span>
            {sortedVaccinations.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                {sortedVaccinations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Registros Médicos */}
        <TabsContent value="records" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => navigate(`/pets/${petId}/medical/new`)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Agregar Registro Médico</span>
              <span className="sm:hidden">Agregar Registro</span>
            </Button>
          </div>

          {isRecordsLoading ? (
            <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              <span className="sr-only">Cargando registros médicos...</span>
            </div>
          ) : recordsError ? (
            <Card className="border-red-200 bg-red-50" role="alert">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-sm text-red-900">
                    <p className="font-medium">Error al cargar registros médicos</p>
                    <p className="mt-1">{recordsError.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : sortedRecords.length === 0 ? (
            <Card>
              <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center p-4 sm:p-6">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  No hay registros médicos para {pet.name}
                </p>
                <Button onClick={() => navigate(`/pets/${petId}/medical/new`)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Crear primer registro
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {sortedRecords.map((record) => (
                <MedicalRecordCard
                  key={record.id}
                  record={record}
                  onClick={() => navigate(`/medical-records/${record.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Vacunas */}
        <TabsContent value="vaccinations" className="space-y-4">
          {vaccinations && vaccinations.length > 0 && (
            <VaccinationAlert
              vaccinations={vaccinations}
              onViewAll={handleViewAllVaccinations}
            />
          )}

          <div className="flex justify-end">
            <Button onClick={() => navigate(`/pets/${petId}/medical/vaccinations/new`)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Registrar Vacuna</span>
              <span className="sm:hidden">Registrar</span>
            </Button>
          </div>

          {isVaccinationsLoading ? (
            <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              <span className="sr-only">Cargando vacunas...</span>
            </div>
          ) : vaccinationsError ? (
            <Card className="border-red-200 bg-red-50" role="alert">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-sm text-red-900">
                    <p className="font-medium">Error al cargar vacunas</p>
                    <p className="mt-1">{vaccinationsError.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : sortedVaccinations.length === 0 ? (
            <Card>
              <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center p-4 sm:p-6">
                <Syringe className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  No hay vacunas registradas para {pet.name}
                </p>
                <Button onClick={() => navigate(`/pets/${petId}/medical/vaccinations/new`)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Registrar primera vacuna
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {sortedVaccinations.map((vaccination) => (
                <VaccinationCard key={vaccination.id} vaccination={vaccination} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
