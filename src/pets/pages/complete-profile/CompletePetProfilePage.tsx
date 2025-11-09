import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Loader2, AlertCircle, Edit, Activity, FileText, Syringe, Sparkles, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompleteProfile } from '@/pets/hooks';
import { PetAvatar } from '@/pets/components';
import { PetAgeCalculatorService } from '@/pets/services';
import { PetOverviewTab } from './components/PetOverviewTab';
import { MedicalRecordCard, VaccinationCard, VaccinationAlert } from '@/medical/components';
import { VaccinationService } from '@/medical/services';
import { GroomingRecordCard, GroomingStatsCard } from '@/grooming/components';
import { GroomingStatsService } from '@/grooming/services';
import { AppointmentCard } from '@/appointments/components';

/**
 * Página de perfil completo de mascota con vista consolidada
 * Muestra toda la información relacionada con una mascota en tabs:
 * - Overview: Información básica, estadísticas y timeline de actividades
 * - Médico: Historial médico y vacunas
 * - Grooming: Historial de grooming y estadísticas
 * - Citas: Próximas citas y historial
 */
export function CompletePetProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: profile, isLoading, error } = useCompleteProfile(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Cargando perfil completo...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12" role="alert">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
          <p className="text-red-600">Error al cargar el perfil completo de la mascota</p>
          <Button onClick={() => navigate('/pets')} className="mt-4">
            Volver a Mis Mascotas
          </Button>
        </div>
      </div>
    );
  }

  const { pet } = profile;
  const age = PetAgeCalculatorService.getFormattedAge(pet.birthDate);

  // Ordenar registros médicos y vacunas
  const sortedMedicalRecords = profile.medicalHistory.recentVisits
    ? [...profile.medicalHistory.recentVisits].sort((a, b) => {
        const dateA = new Date(a.visitDate);
        const dateB = new Date(b.visitDate);
        return dateB.getTime() - dateA.getTime();
      })
    : [];

  const sortedVaccinations = profile.vaccinations.activeVaccines
    ? VaccinationService.sortByDueDate(profile.vaccinations.activeVaccines)
    : [];

  // Ordenar registros de grooming
  const sortedGroomingRecords = profile.groomingHistory.recentSessions
    ? GroomingStatsService.sortByDate(profile.groomingHistory.recentSessions, 'desc')
    : [];

  // Separar citas upcoming y past
  const upcomingAppointments = profile.appointments.upcoming || [];
  const pastAppointments = profile.appointments.past || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header con información destacada */}
      <div className="mb-4 sm:mb-6">
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
          {/* Avatar */}
          <div className="shrink-0">
            <PetAvatar pet={pet} size="lg" />
          </div>

          {/* Pet info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-pet-name">{pet.name}</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 capitalize">
              {pet.breed || pet.species} • {age}
            </p>
            <div className="flex gap-2 mt-3 sm:mt-4 justify-center md:justify-start flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/pets/${pet.id}/edit`)}
              >
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" aria-hidden="true" />
                <span className="hidden xs:inline">Editar Perfil</span>
                <span className="xs:hidden">Editar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 sm:mb-6 h-auto">
          <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Resumen</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Syringe className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden xs:inline">Médico</span>
            <span className="xs:hidden">Med</span>
            {profile.medicalHistory.totalVisits > 0 && (
              <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs bg-primary/10 px-1 sm:px-1.5 py-0.5 rounded-full">
                {profile.medicalHistory.totalVisits}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="grooming" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden xs:inline">Grooming</span>
            <span className="xs:hidden">Grm</span>
            {profile.groomingHistory.totalSessions > 0 && (
              <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs bg-primary/10 px-1 sm:px-1.5 py-0.5 rounded-full">
                {profile.groomingHistory.totalSessions}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden xs:inline">Citas</span>
            <span className="xs:hidden">Cit</span>
            {profile.appointments.totalAppointments > 0 && (
              <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs bg-primary/10 px-1 sm:px-1.5 py-0.5 rounded-full">
                {profile.appointments.totalAppointments}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Overview */}
        <TabsContent value="overview">
          <PetOverviewTab profile={profile} />
        </TabsContent>

        {/* Tab: Médico */}
        <TabsContent value="medical" className="space-y-3 sm:space-y-4">
          {/* Alerta de vacunas */}
          {profile.vaccinations.activeVaccines.length > 0 && (
            <VaccinationAlert
              vaccinations={profile.vaccinations.activeVaccines}
              onViewAll={() => {}}
            />
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => navigate(`/pets/${pet.id}/medical`)}
              className="w-full sm:w-auto text-sm"
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" aria-hidden="true" />
              Ver Historial Completo
            </Button>
          </div>

          {/* Vacunas */}
          {sortedVaccinations.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold">Vacunas Activas ({sortedVaccinations.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {sortedVaccinations.map((vaccination) => (
                  <VaccinationCard key={vaccination.id} vaccination={vaccination} />
                ))}
              </div>
            </div>
          )}

          {/* Registros médicos */}
          {sortedMedicalRecords.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold">
                Visitas Recientes ({sortedMedicalRecords.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {sortedMedicalRecords.map((record) => (
                  <MedicalRecordCard
                    key={record.id}
                    record={record}
                    onClick={() => navigate(`/medical-records/${record.id}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  No hay registros médicos para {pet.name}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Grooming */}
        <TabsContent value="grooming" className="space-y-3 sm:space-y-4">
          {/* Estadísticas */}
          {sortedGroomingRecords.length > 0 && (
            <GroomingStatsCard records={sortedGroomingRecords} />
          )}

          {/* Botón de acción */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => navigate(`/pets/${pet.id}/grooming`)}
              className="w-full sm:w-auto text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" aria-hidden="true" />
              Ver Historial Completo
            </Button>
          </div>

          {/* Registros de grooming */}
          {sortedGroomingRecords.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold">
                Sesiones Recientes ({sortedGroomingRecords.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {sortedGroomingRecords.map((record) => (
                  <GroomingRecordCard
                    key={record.id}
                    record={record}
                    onClick={() => navigate(`/grooming-records/${record.id}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center">
                <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  No hay sesiones de grooming para {pet.name}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Citas */}
        <TabsContent value="appointments" className="space-y-3 sm:space-y-4">
          {/* Botón de acción */}
          <div className="flex justify-end">
            <Button onClick={() => navigate('/appointments/new')} className="w-full sm:w-auto text-sm">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" aria-hidden="true" />
              Agendar Nueva Cita
            </Button>
          </div>

          {/* Próximas citas */}
          {upcomingAppointments.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold">
                Próximas Citas ({upcomingAppointments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={{
                      ...appointment,
                      date: appointment.date instanceof Date ? appointment.date.toISOString() : appointment.date,
                      status: appointment.status as any,
                      service: appointment.service as any, // Service viene del backend con estructura completa
                      customer: appointment.customer as any, // Customer viene del backend con estructura completa
                      createdAt: appointment.createdAt instanceof Date ? appointment.createdAt.toISOString() : appointment.createdAt,
                      updatedAt: appointment.updatedAt instanceof Date ? appointment.updatedAt.toISOString() : appointment.updatedAt,
                    } as any}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Citas pasadas */}
          {pastAppointments.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold">
                Historial de Citas ({pastAppointments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={{
                      ...appointment,
                      date: appointment.date instanceof Date ? appointment.date.toISOString() : appointment.date,
                      status: appointment.status as any,
                      service: appointment.service as any, // Service viene del backend con estructura completa
                      customer: appointment.customer as any, // Customer viene del backend con estructura completa
                      createdAt: appointment.createdAt instanceof Date ? appointment.createdAt.toISOString() : appointment.createdAt,
                      updatedAt: appointment.updatedAt instanceof Date ? appointment.updatedAt.toISOString() : appointment.updatedAt,
                    } as any}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sin citas */}
          {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
            <Card>
              <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  No hay citas registradas para {pet.name}
                </p>
                <Button onClick={() => navigate('/appointments/new')} className="w-full sm:w-auto">
                  <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                  Agendar Primera Cita
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
