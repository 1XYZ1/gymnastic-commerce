import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Stethoscope, User, DollarSign, Scale, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MedicalRecord } from '../types';
import { VISIT_TYPE_LABELS, VISIT_TYPE_COLORS } from '../config';
import { cn } from '@/lib/utils';

interface MedicalRecordCardProps {
  record: MedicalRecord;
  onClick?: () => void;
}

export function MedicalRecordCard({ record, onClick }: MedicalRecordCardProps) {
  const visitDate = record.visitDate instanceof Date
    ? record.visitDate
    : new Date(record.visitDate);

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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium">
                {format(visitDate, "PPP", { locale: es })}
              </span>
            </div>
            <h3 className="font-semibold text-sm sm:text-base leading-tight truncate">
              {record.reason}
            </h3>
          </div>
          <Badge
            variant="outline"
            className={cn("flex-shrink-0 text-xs", VISIT_TYPE_COLORS[record.visitType])}
          >
            {VISIT_TYPE_LABELS[record.visitType]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
        {record.diagnosis && (
          <div className="flex items-start gap-2">
            <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Diagnóstico</p>
              <p className="text-xs sm:text-sm line-clamp-2">{record.diagnosis}</p>
            </div>
          </div>
        )}

        {record.veterinarian && (
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Veterinario</p>
              <p className="text-xs sm:text-sm font-medium truncate">{record.veterinarian.fullName}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {record.weightAtVisit !== undefined && (
            <div className="flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span className="text-muted-foreground text-xs">Peso:</span>
              <span className="font-medium text-xs sm:text-sm">{record.weightAtVisit} kg</span>
            </div>
          )}

          {record.temperature !== undefined && (
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span className="text-muted-foreground text-xs">Temp:</span>
              <span className="font-medium text-xs sm:text-sm">{record.temperature}°C</span>
            </div>
          )}

          {record.serviceCost !== undefined && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span className="text-muted-foreground text-xs">Costo:</span>
              <span className="font-medium text-xs sm:text-sm">${record.serviceCost}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
