import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/auth/store/auth.store';
import { SERVICE_TYPE_LABELS } from '../config/service.config';
import type { Service } from '../types/service.types';

interface ServiceDetailProps {
  service: Service;
}

/**
 * Componente para mostrar el detalle completo de un servicio
 * Incluye toda la información del servicio y botón para agendar cita
 */
export const ServiceDetail = ({ service }: ServiceDetailProps) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.authStatus === 'authenticated');

  const handleScheduleAppointment = () => {
    if (!isAuthenticated) {
      // Redirigir a login con returnUrl
      navigate(`/auth/login?returnUrl=/appointments/new?serviceId=${service.id}`);
      return;
    }
    // Navegar a crear cita con servicio preseleccionado
    navigate(`/appointments/new?serviceId=${service.id}`);
  };
  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen del servicio */}
          <div className="aspect-square overflow-hidden bg-muted rounded-lg">
            {service.image ? (
              <img
                src={service.image}
                alt={`${service.name} - ${SERVICE_TYPE_LABELS[service.type]}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-9xl">
                {service.type === 'grooming' ? '🐕' : '⚕️'}
              </div>
            )}
          </div>

          {/* Información del servicio */}
          <div className="space-y-6">
            {/* Encabezado */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
                <Badge variant={service.isActive ? 'default' : 'secondary'}>
                  {service.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <Badge variant="outline" className="text-sm">
                {SERVICE_TYPE_LABELS[service.type]}
              </Badge>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            {/* Detalles del servicio */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Detalles</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Precio</span>
                  <span className="text-lg font-semibold">${service.price}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Duración estimada</span>
                  <span className="font-medium">{service.durationMinutes} minutos</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Tipo de servicio</span>
                  <span className="font-medium">{SERVICE_TYPE_LABELS[service.type]}</span>
                </div>
              </div>
            </div>

            {/* Botón de agendar cita */}
            <div className="pt-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handleScheduleAppointment}
                disabled={!service.isActive}
              >
                {isAuthenticated ? 'Agendar cita' : 'Iniciar sesión para agendar'}
              </Button>
            </div>

            {/* Nota informativa */}
            {!service.isActive && (
              <p className="text-xs text-muted-foreground text-center">
                Este servicio no está disponible temporalmente.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
