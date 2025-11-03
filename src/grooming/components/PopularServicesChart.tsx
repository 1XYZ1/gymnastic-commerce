import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { GroomingRecord } from '../types';
import { GroomingStatsService } from '../services';

interface PopularServicesChartProps {
  records: GroomingRecord[];
}

export function PopularServicesChart({ records }: PopularServicesChartProps) {
  // Validar que records sea un array
  const safeRecords = Array.isArray(records) ? records : [];
  const mostCommonServices = GroomingStatsService.getMostCommonServices(safeRecords, 5);

  if (mostCommonServices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Servicios Más Comunes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay datos suficientes para mostrar estadísticas
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calcular el máximo para escalar las barras
  const maxCount = Math.max(...mostCommonServices.map(s => s.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Servicios Más Comunes</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {mostCommonServices.map((service, index) => {
            const percentage = (service.count / maxCount) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium truncate flex-1 mr-2">
                    {service.service}
                  </span>
                  <span className="text-muted-foreground flex-shrink-0">
                    {service.count} {service.count === 1 ? 'vez' : 'veces'}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
