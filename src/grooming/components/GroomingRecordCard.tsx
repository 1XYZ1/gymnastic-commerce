import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Scissors, Clock, DollarSign, User, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { GroomingRecord } from '../types';
import { COAT_CONDITION_COLORS } from '../config';
import { cn } from '@/lib/utils';

interface GroomingRecordCardProps {
  record: GroomingRecord;
  onClick?: () => void;
}

export function GroomingRecordCard({ record, onClick }: GroomingRecordCardProps) {
  const sessionDate = record.sessionDate instanceof Date
    ? record.sessionDate
    : new Date(record.sessionDate);

  // Limitar servicios visibles a 3
  const visibleServices = record.servicesPerformed.slice(0, 3);
  const remainingCount = record.servicesPerformed.length - 3;

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
      <CardHeader className="p-4 sm:pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {format(sessionDate, "PPP", { locale: es })}
              </span>
            </div>

            {/* Servicios realizados */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              {visibleServices.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{remainingCount} más
                </Badge>
              )}
            </div>
          </div>

          {/* Badge de condición del pelaje */}
          {record.coatCondition && (
            <Badge
              variant="outline"
              className={cn(
                "flex-shrink-0 text-xs",
                COAT_CONDITION_COLORS[record.coatCondition] || "bg-gray-100 text-gray-800"
              )}
            >
              {record.coatCondition}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Estilo de corte */}
          {record.hairStyle && (
            <div className="flex items-center gap-2">
              <Scissors className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Estilo</p>
                <p className="text-xs sm:text-sm font-medium truncate">{record.hairStyle}</p>
              </div>
            </div>
          )}

          {/* Duración */}
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground">Duración</p>
              <p className="text-xs sm:text-sm font-medium">{record.durationMinutes} min</p>
            </div>
          </div>

          {/* Costo */}
          {record.serviceCost !== undefined && record.serviceCost !== null && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Costo</p>
                <p className="text-xs sm:text-sm font-medium">
                  ${typeof record.serviceCost === 'number' ? record.serviceCost.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          )}

          {/* Groomer */}
          {record.groomer && (
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Groomer</p>
                <p className="text-xs sm:text-sm font-medium truncate">{record.groomer.fullName}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
