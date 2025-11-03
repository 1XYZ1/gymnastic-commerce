import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TemperamentBadge } from '@/pets/components';
import { PetActivityTimeline } from './PetActivityTimeline';
import { FileText, Sparkles, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CompleteProfile } from '@/pets/types';

interface PetOverviewTabProps {
  profile: CompleteProfile;
}

/**
 * Tab de overview del perfil completo de mascota
 * Muestra información básica, estadísticas rápidas y timeline de actividades
 */
export function PetOverviewTab({ profile }: PetOverviewTabProps) {
  const { pet, medicalHistory, groomingHistory, appointments, summary } = profile;

  // Formatear fecha de nacimiento
  const birthDateFormatted = format(
    new Date(pet.birthDate),
    "dd 'de' MMMM 'de' yyyy",
    { locale: es }
  );

  // Formatear última visita si existe
  const lastVisitFormatted = summary.lastVisitDate
    ? format(new Date(summary.lastVisitDate), "dd 'de' MMMM 'de' yyyy", { locale: es })
    : 'Sin visitas registradas';

  // Formatear próxima vacuna si existe
  const nextVaccinationFormatted = summary.nextVaccinationDue
    ? format(new Date(summary.nextVaccinationDue), "dd 'de' MMMM 'de' yyyy", { locale: es })
    : 'No hay vacunas pendientes';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Grid de información básica y estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Información Básica */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Información Básica</CardTitle>
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
            <Separator />
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-muted-foreground">Temperamento:</span>
              <TemperamentBadge temperament={pet.temperament} />
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas Rápidas */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Estadísticas Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Visitas Médicas */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0" aria-hidden="true">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Visitas Médicas</p>
                <p className="text-base sm:text-lg font-bold">{medicalHistory.totalVisits}</p>
              </div>
            </div>

            {/* Sesiones de Grooming */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-purple-100 text-purple-600 shrink-0" aria-hidden="true">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Sesiones de Grooming</p>
                <p className="text-base sm:text-lg font-bold">{groomingHistory.totalSessions}</p>
              </div>
            </div>

            {/* Total de Citas */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 text-green-600 shrink-0" aria-hidden="true">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Total de Citas</p>
                <p className="text-base sm:text-lg font-bold">{appointments.totalAppointments}</p>
              </div>
            </div>

            {/* Gasto Total */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-orange-600 shrink-0" aria-hidden="true">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Gasto Total</p>
                <p className="text-base sm:text-lg font-bold">
                  ${(summary.totalSpentMedical + summary.totalSpentGrooming).toFixed(2)}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                  Médico: ${summary.totalSpentMedical.toFixed(2)} | Grooming: ${summary.totalSpentGrooming.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Salud */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Resumen de Salud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-muted-foreground">Última visita médica:</span>
            <span className="font-medium text-right">{lastVisitFormatted}</span>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-muted-foreground">Próxima vacuna:</span>
            <span className="font-medium text-right">{nextVaccinationFormatted}</span>
          </div>
          {groomingHistory.lastSessionDate && (
            <>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground">Última sesión de grooming:</span>
                <span className="font-medium text-right">
                  {format(
                    new Date(groomingHistory.lastSessionDate),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: es }
                  )}
                </span>
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
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Notas Generales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-muted-foreground">{pet.generalNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Timeline de Actividades Recientes */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Actividades Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <PetActivityTimeline profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
