import { Calendar, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { GroomingRecord } from '../types';
import { GroomingStatsService } from '../services';

interface GroomingStatsCardProps {
  records: GroomingRecord[];
}

export function GroomingStatsCard({ records }: GroomingStatsCardProps) {
  // Validar que records sea un array
  const safeRecords = Array.isArray(records) ? records : [];

  const totalSessions = GroomingStatsService.getTotalSessions(safeRecords);
  const totalSpent = GroomingStatsService.getTotalSpent(safeRecords);
  const averageDuration = GroomingStatsService.getAverageDuration(safeRecords);
  const daysSinceLastSession = GroomingStatsService.getDaysSinceLastSession(safeRecords);

  const stats = [
    {
      label: 'Total de Sesiones',
      value: totalSessions.toString(),
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      label: 'Total Gastado',
      value: `$${(totalSpent || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Duración Promedio',
      value: averageDuration > 0 ? `${averageDuration} min` : 'N/A',
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      label: 'Días desde última sesión',
      value: daysSinceLastSession !== null ? `${daysSinceLastSession} días` : 'Sin registro',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4 sm:pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-base sm:text-lg font-bold truncate">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
