import { Card, CardContent } from '@/components/ui/card';
import { ServiceCard } from './ServiceCard';
import type { Service } from '../types/service.types';

interface ServicesListProps {
  services: Service[];
  isLoading?: boolean;
}

/**
 * Skeleton loader para ServiceCard
 */
const ServiceCardSkeleton = () => (
  <Card className="h-full border shadow-sm overflow-hidden">
    <CardContent className="p-0 h-full flex flex-col">
      {/* Imagen skeleton */}
      <div className="aspect-square bg-gradient-to-br from-muted to-muted/60 animate-pulse" />

      {/* Contenido skeleton */}
      <div className="flex-1 flex flex-col p-5 space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-muted rounded-md w-3/4 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
            <div className="h-4 bg-muted rounded-md w-5/6 animate-pulse" />
          </div>
        </div>

        {/* Duration skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
          <div className="h-4 bg-muted rounded-md w-24 animate-pulse" />
        </div>

        {/* Price section skeleton */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-3 bg-muted rounded-md w-16 animate-pulse" />
              <div className="h-8 bg-muted rounded-md w-20 animate-pulse" />
            </div>
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
 * Componente que muestra un grid de tarjetas de servicios
 * Maneja estados de carga y lista vacía
 */
export const ServicesList = ({ services, isLoading = false }: ServicesListProps) => {
  // Estado de carga con skeleton loader mejorado
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="status"
        aria-live="polite"
        aria-label="Cargando servicios"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
        <span className="sr-only">Cargando servicios disponibles...</span>
      </div>
    );
  }

  // Estado vacío mejorado
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div
          className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl mb-6"
          aria-hidden="true"
        >
          🔍
        </div>
        <h3 className="text-xl font-semibold mb-2 tracking-tight">
          No se encontraron servicios
        </h3>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          No hay servicios disponibles en este momento. Por favor, vuelve más tarde o contacta con nosotros para más información.
        </p>
      </div>
    );
  }

  // Grid de servicios con altura uniforme
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
