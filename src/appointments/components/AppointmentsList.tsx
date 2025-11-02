import { Card, CardContent } from '@/components/ui/card';
import { AppointmentCard } from './AppointmentCard';
import type { Appointment } from '../types/appointment.types';

interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

/**
 * Skeleton loader para AppointmentCard
 */
const AppointmentCardSkeleton = () => (
  <Card className="h-full border shadow-sm overflow-hidden">
    <CardContent className="p-0 h-full flex flex-col">
      {/* Imagen skeleton */}
      <div className="aspect-square bg-gradient-to-br from-muted to-muted/60 animate-pulse relative">
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3">
          <div className="h-6 w-20 bg-background/90 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Contenido skeleton */}
      <div className="flex-1 flex flex-col p-5 space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded-md w-32 animate-pulse" />
          </div>
          <div className="h-5 bg-muted rounded-md w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded-md w-1/2 animate-pulse" />
        </div>

        {/* Service info skeleton */}
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-muted rounded-md w-16 animate-pulse" />
          <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
          <div className="h-3 bg-muted rounded-md w-2/3 animate-pulse" />
        </div>

        {/* Price section skeleton */}
        <div className="space-y-3 pt-2 border-t">
          <div className="space-y-1.5">
            <div className="h-3 bg-muted rounded-md w-16 animate-pulse" />
            <div className="h-8 bg-muted rounded-md w-20 animate-pulse" />
          </div>

          {/* Buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="h-11 sm:h-10 bg-muted rounded-md flex-1 animate-pulse" />
            <div className="h-11 sm:h-10 bg-muted rounded-md flex-1 animate-pulse" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Componente de lista/grid para mostrar múltiples citas
 * Utiliza grid responsivo para mostrar las tarjetas
 */
export const AppointmentsList = ({ appointments, isLoading = false }: AppointmentsListProps) => {
  // Estado de carga con skeleton mejorado
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="status"
        aria-live="polite"
        aria-label="Cargando citas"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <AppointmentCardSkeleton key={i} />
        ))}
        <span className="sr-only">Cargando citas programadas...</span>
      </div>
    );
  }

  // Estado vacío mejorado
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div
          className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl mb-6"
          aria-hidden="true"
        >
          📅
        </div>
        <h3 className="text-xl font-semibold mb-2 tracking-tight">
          No hay citas registradas
        </h3>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          Cuando agendes una cita, aparecerá aquí. Explora nuestros servicios y agenda tu primera cita para tu mascota.
        </p>
      </div>
    );
  }

  // Grid de citas con altura uniforme
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
};
