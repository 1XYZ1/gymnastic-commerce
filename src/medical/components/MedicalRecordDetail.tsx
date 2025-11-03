import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Stethoscope,
  User,
  DollarSign,
  Scale,
  Thermometer,
  FileText,
  Pill,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { MedicalRecord } from '../types';
import { VISIT_TYPE_LABELS, VISIT_TYPE_COLORS } from '../config';
import { cn } from '@/lib/utils';

interface MedicalRecordDetailProps {
  record: MedicalRecord;
}

export function MedicalRecordDetail({ record }: MedicalRecordDetailProps) {
  const visitDate = record.visitDate instanceof Date
    ? record.visitDate
    : new Date(record.visitDate);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Información General */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">Información General</CardTitle>
            <Badge
              variant="outline"
              className={cn("flex-shrink-0 text-xs", VISIT_TYPE_COLORS[record.visitType])}
            >
              {VISIT_TYPE_LABELS[record.visitType]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Fecha de Visita</p>
              <p className="font-medium text-sm sm:text-base">
                {format(visitDate, "PPP 'a las' HH:mm", { locale: es })}
              </p>
            </div>
          </div>

          {record.veterinarian && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Veterinario</p>
                  <p className="font-medium text-sm sm:text-base">{record.veterinarian.fullName}</p>
                  {record.veterinarian.email && (
                    <p className="text-xs sm:text-sm text-muted-foreground">{record.veterinarian.email}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Motivo de Consulta */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Motivo de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <p className="text-sm sm:text-base">{record.reason}</p>
        </CardContent>
      </Card>

      {/* Diagnóstico */}
      {record.diagnosis && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
              Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base whitespace-pre-wrap">{record.diagnosis}</p>
          </CardContent>
        </Card>
      )}

      {/* Tratamiento */}
      {record.treatment && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Pill className="h-4 w-4 sm:h-5 sm:w-5" />
              Tratamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base whitespace-pre-wrap">{record.treatment}</p>
          </CardContent>
        </Card>
      )}

      {/* Mediciones */}
      {(record.weightAtVisit !== undefined || record.temperature !== undefined) && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Mediciones</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6 pt-0">
            {record.weightAtVisit !== undefined && (
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted rounded-lg">
                <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Peso</p>
                  <p className="text-base sm:text-lg font-semibold">{record.weightAtVisit} kg</p>
                </div>
              </div>
            )}

            {record.temperature !== undefined && (
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted rounded-lg">
                <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Temperatura</p>
                  <p className="text-base sm:text-lg font-semibold">{record.temperature}°C</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notas Adicionales */}
      {record.notes && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Notas Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base whitespace-pre-wrap">{record.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Costo del Servicio */}
      {record.serviceCost !== undefined && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              Costo del Servicio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xl sm:text-2xl font-bold text-primary">
              ${record.serviceCost.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
