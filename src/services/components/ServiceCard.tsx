import { useNavigate } from 'react-router';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICE_TYPE_LABELS } from '../config/service.config';
import { useAuthStore } from '@/auth/store/auth.store';
import type { Service } from '../types/service.types';

interface ServiceCardProps {
  service: Service;
}

/**
 * Componente de tarjeta para mostrar un servicio en el listado
 * Presenta información básica y permite navegar al detalle o agendar cita
 */
export const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();
  const authStatus = useAuthStore((state) => state.authStatus);
  const isAuthenticated = authStatus === 'authenticated';

  const handleCardClick = () => {
    navigate(`/services/${service.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/services/${service.id}`);
  };

  const handleBookAppointment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/auth/login?returnUrl=/appointments/new?serviceId=${service.id}`);
      return;
    }
    navigate(`/appointments/new?serviceId=${service.id}`);
  };

  // Truncar descripción a 100 caracteres
  const truncatedDescription =
    service.description.length > 100
      ? `${service.description.substring(0, 100)}...`
      : service.description;

  return (
    <Card
      className="group h-full border shadow-sm product-card-hover cursor-pointer overflow-hidden"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${service.name}, ${SERVICE_TYPE_LABELS[service.type]}, precio $${service.price}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Imagen del servicio */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/60">
          {service.image ? (
            <img
              src={service.image}
              alt={`${service.name} - ${SERVICE_TYPE_LABELS[service.type]}`}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-7xl opacity-40">
              {service.type === 'grooming' ? '🐕' : '⚕️'}
            </div>
          )}
          <div className="image-overlay" aria-hidden="true" />

          {/* Badge floating on image */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="text-xs shadow-md backdrop-blur-sm bg-background/90">
              {SERVICE_TYPE_LABELS[service.type]}
            </Badge>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="flex-1 flex flex-col p-5 space-y-4">
          {/* Header */}
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-base tracking-tight leading-tight line-clamp-2">
              {service.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {truncatedDescription}
            </p>
          </div>

          {/* Duration info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-medium">{service.durationMinutes} minutos</span>
          </div>

          {/* Price and CTA */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Precio</p>
                <p className="font-bold text-2xl tracking-tight" aria-label={`Precio: ${service.price} pesos`}>
                  ${service.price}
                </p>
              </div>
            </div>

            {/* Botones de acción - Siempre visibles en mobile, hover en desktop */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                size="sm"
                className="w-full sm:flex-1 text-sm h-11 sm:h-10 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 transition-all duration-300"
                onClick={handleBookAppointment}
                aria-label={`Agendar cita para ${service.name}`}
              >
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                Agendar cita
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full sm:flex-1 text-sm h-11 sm:h-10 border-primary/20 hover:bg-primary/5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 transition-all duration-300"
                onClick={handleViewDetails}
                aria-label={`Ver detalles de ${service.name}`}
              >
                Ver detalles
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
