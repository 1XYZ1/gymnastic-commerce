import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  Scissors,
  Sparkles,
  Heart,
  Eye,
  MessageSquare,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { GroomingRecord } from '../types';
import {
  COAT_CONDITION_COLORS,
  SKIN_CONDITION_COLORS,
  BEHAVIOR_COLORS,
} from '../config';
import { cn } from '@/lib/utils';

interface GroomingRecordDetailProps {
  record: GroomingRecord;
}

export function GroomingRecordDetail({ record }: GroomingRecordDetailProps) {
  const sessionDate = record.sessionDate instanceof Date
    ? record.sessionDate
    : new Date(record.sessionDate);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Fecha de Sesión</p>
              <p className="text-sm sm:text-base font-medium">{format(sessionDate, "PPP", { locale: es })}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Hora</p>
              <p className="text-sm sm:text-base font-medium">{format(sessionDate, "p", { locale: es })}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <p className="text-xs sm:text-sm text-muted-foreground">Duración</p>
              </div>
              <p className="text-sm sm:text-base font-medium">{record.durationMinutes} minutos</p>
            </div>

            {record.serviceCost !== undefined && record.serviceCost !== null && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Costo</p>
                </div>
                <p className="text-sm sm:text-base font-medium text-green-600">
                  ${typeof record.serviceCost === 'number' ? record.serviceCost.toFixed(2) : '0.00'}
                </p>
              </div>
            )}

            {record.groomer && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Groomer</p>
                </div>
                <p className="text-sm sm:text-base font-medium">{record.groomer.fullName}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Servicios Realizados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            Servicios Realizados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {record.servicesPerformed.map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                {service}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estilo y Apariencia */}
      {(record.hairStyle || (record.productsUsed && record.productsUsed.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Scissors className="h-4 w-4 sm:h-5 sm:w-5" />
              Estilo y Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {record.hairStyle && (
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Estilo de Corte</p>
                <p className="text-sm sm:text-base font-medium">{record.hairStyle}</p>
              </div>
            )}

            {record.productsUsed && record.productsUsed.length > 0 && (
              <>
                {record.hairStyle && <Separator />}
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">Productos Usados</p>
                  <div className="flex flex-wrap gap-2">
                    {record.productsUsed.map((product, index) => (
                      <Badge key={index} variant="outline" className="text-xs sm:text-sm">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Condición */}
      {(record.skinCondition || record.coatCondition) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              Condición
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {record.skinCondition && (
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">Condición de Piel</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs sm:text-sm",
                      SKIN_CONDITION_COLORS[record.skinCondition] || "bg-gray-100 text-gray-800"
                    )}
                  >
                    {record.skinCondition}
                  </Badge>
                </div>
              )}

              {record.coatCondition && (
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">Condición de Pelaje</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs sm:text-sm",
                      COAT_CONDITION_COLORS[record.coatCondition] || "bg-gray-100 text-gray-800"
                    )}
                  >
                    {record.coatCondition}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comportamiento */}
      {record.behaviorDuringSession && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              Comportamiento Durante Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Badge
              variant="outline"
              className={cn(
                "text-xs sm:text-sm",
                BEHAVIOR_COLORS[record.behaviorDuringSession] || "bg-gray-100 text-gray-800"
              )}
            >
              {record.behaviorDuringSession}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Observaciones */}
      {record.observations && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm whitespace-pre-wrap">{record.observations}</p>
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones */}
      {record.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm whitespace-pre-wrap">{record.recommendations}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
