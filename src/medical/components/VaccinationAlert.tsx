import { AlertTriangle, Syringe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { Vaccination } from '../types';
import { VaccinationService } from '../services';

interface VaccinationAlertProps {
  vaccinations: Vaccination[];
  onViewAll?: () => void;
}

export function VaccinationAlert({ vaccinations, onViewAll }: VaccinationAlertProps) {
  const upcomingVaccinations = VaccinationService.getUpcomingVaccinations(vaccinations);
  const overdueVaccinations = VaccinationService.getOverdueVaccinations(vaccinations);

  const hasOverdue = overdueVaccinations.length > 0;
  const hasUpcoming = upcomingVaccinations.length > 0;

  if (!hasOverdue && !hasUpcoming) {
    return null;
  }

  return (
    <Alert variant={hasOverdue ? 'destructive' : 'default'} className="mb-4 sm:mb-6" role="alert">
      <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
      <AlertTitle className="flex items-center justify-between text-sm sm:text-base">
        <span>
          {hasOverdue ? 'Vacunas vencidas' : 'Vacunas próximas a vencer'}
        </span>
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        {hasOverdue && (
          <p className="text-xs sm:text-sm font-medium">
            Tienes {overdueVaccinations.length} vacuna{overdueVaccinations.length > 1 ? 's' : ''} vencida{overdueVaccinations.length > 1 ? 's' : ''}
          </p>
        )}
        {hasUpcoming && (
          <p className="text-xs sm:text-sm">
            {upcomingVaccinations.length} vacuna{upcomingVaccinations.length > 1 ? 's' : ''} próxima{upcomingVaccinations.length > 1 ? 's' : ''} a vencer en los próximos 30 días
          </p>
        )}

        <ul className="text-xs sm:text-sm space-y-1 mt-2">
          {overdueVaccinations.slice(0, 3).map((vac) => {
            const daysOverdue = Math.abs(VaccinationService.getDaysUntilDue(vac) || 0);
            return (
              <li key={vac.id} className="flex items-start gap-2">
                <Syringe className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  <strong>{vac.vaccineName}</strong> - Vencida hace {daysOverdue} día{daysOverdue > 1 ? 's' : ''}
                </span>
              </li>
            );
          })}
          {upcomingVaccinations.slice(0, 3 - overdueVaccinations.length).map((vac) => {
            const daysUntilDue = VaccinationService.getDaysUntilDue(vac) || 0;
            return (
              <li key={vac.id} className="flex items-start gap-2">
                <Syringe className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  <strong>{vac.vaccineName}</strong> - Vence en {daysUntilDue} día{daysUntilDue > 1 ? 's' : ''}
                </span>
              </li>
            );
          })}
        </ul>

        {onViewAll && (
          <Button
            variant={hasOverdue ? 'outline' : 'secondary'}
            size="sm"
            onClick={onViewAll}
            className="mt-3 w-full sm:w-auto"
          >
            Ver todas las vacunas
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
