import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Syringe, Calendar, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Vaccination } from '../types';
import { VaccinationService } from '../services';
import { VACCINATION_STATUS_LABELS, VACCINATION_STATUS_COLORS } from '../config';
import { cn } from '@/lib/utils';

interface VaccinationCardProps {
  vaccination: Vaccination;
  onClick?: () => void;
}

export function VaccinationCard({ vaccination, onClick }: VaccinationCardProps) {
  const administeredDate = vaccination.administeredDate instanceof Date
    ? vaccination.administeredDate
    : new Date(vaccination.administeredDate);

  const status = VaccinationService.getVaccinationStatus(vaccination);
  const daysUntilDue = VaccinationService.getDaysUntilDue(vaccination);

  const getStatusIcon = () => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      case 'upcoming':
        return <AlertTriangle className="h-4 w-4" />;
      case 'current':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getDaysMessage = () => {
    if (daysUntilDue === null) return null;
    if (daysUntilDue < 0) return `Vencida hace ${Math.abs(daysUntilDue)} días`;
    if (daysUntilDue === 0) return 'Vence hoy';
    if (daysUntilDue === 1) return 'Vence mañana';
    return `Vence en ${daysUntilDue} días`;
  };

  return (
    <Card
      className={cn(
        "transition-shadow duration-200",
        onClick && "cursor-pointer hover:shadow-lg"
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Syringe className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base leading-tight">
                {vaccination.vaccineName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Administrada: {format(administeredDate, "PPP", { locale: es })}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "flex-shrink-0 flex items-center gap-1 text-xs",
              VACCINATION_STATUS_COLORS[status]
            )}
          >
            <span aria-hidden="true">{getStatusIcon()}</span>
            <span className="hidden sm:inline">{VACCINATION_STATUS_LABELS[status]}</span>
            <span className="sr-only sm:hidden">{VACCINATION_STATUS_LABELS[status]}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
        {vaccination.nextDueDate && (
          <div className="flex items-start gap-2">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Próxima aplicación</p>
              <p className="text-xs sm:text-sm font-medium">
                {format(new Date(vaccination.nextDueDate), "PPP", { locale: es })}
              </p>
              {daysUntilDue !== null && (
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    status === 'overdue' && "text-red-600 font-medium",
                    status === 'upcoming' && "text-yellow-600 font-medium",
                    status === 'current' && "text-green-600"
                  )}
                >
                  {getDaysMessage()}
                </p>
              )}
            </div>
          </div>
        )}

        {vaccination.veterinarian && (
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Veterinario</p>
              <p className="text-xs sm:text-sm truncate">{vaccination.veterinarian.fullName}</p>
            </div>
          </div>
        )}

        {vaccination.batchNumber && (
          <div className="text-xs text-muted-foreground">
            Lote: <span className="font-mono">{vaccination.batchNumber}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
