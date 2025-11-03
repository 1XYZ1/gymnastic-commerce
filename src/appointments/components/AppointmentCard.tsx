import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { AppointmentValidationService } from '../services/AppointmentValidationService';
import { useAuthStore } from '@/auth/store/auth.store';
import { useAppointmentMutations } from '../hooks/useAppointmentMutations';
import type { Appointment } from '../types/appointment.types';

interface AppointmentCardProps {
  appointment: Appointment;
}

/**
 * Componente de tarjeta para mostrar una cita en el listado
 * Presenta información completa de la cita, servicio y mascota
 * Incluye acciones según estado y permisos del usuario
 */
export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { cancelAppointment } = useAppointmentMutations();

  const isAdmin = user?.roles.includes('admin');
  const isOwner = user?.id === appointment.customer.id;
  const canCancel = appointment.status !== 'cancelled' && appointment.status !== 'completed';

  const handleCardClick = () => {
    navigate(`/appointments/${appointment.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/appointments/${appointment.id}`);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      cancelAppointment.mutate(appointment.id);
    }
  };

  // Truncar notas a 100 caracteres
  const truncatedNotes = appointment.notes && appointment.notes.length > 100
    ? `${appointment.notes.substring(0, 100)}...`
    : appointment.notes;

  // Formatear fecha
  const formattedDate = AppointmentValidationService.formatDate(appointment.date);

  return (
    <Card
      className="group h-full border shadow-sm product-card-hover cursor-pointer overflow-hidden"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`Cita para ${appointment.pet.name}, servicio ${appointment.service.name}, ${formattedDate}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Imagen del servicio */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/60">
          {appointment.service.image ? (
            <img
              src={appointment.service.image}
              alt={`${appointment.service.name} - ${SERVICE_TYPE_LABELS[appointment.service.type]}`}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-7xl opacity-40">
              {appointment.service.type === 'grooming' ? '🐕' : '⚕️'}
            </div>
          )}
          <div className="image-overlay" aria-hidden="true" />

          {/* Status badge floating on image */}
          <div className="absolute top-3 left-3 z-10">
            <AppointmentStatusBadge status={appointment.status} />
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="flex-1 flex flex-col p-5 space-y-4">
          {/* Header con fecha */}
          <div className="space-y-2">
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
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className="font-medium">{formattedDate}</span>
            </div>

            {/* Información de la mascota */}
            <h3 className="font-semibold text-base tracking-tight leading-tight">
              {appointment.pet.name}
              {appointment.pet.breed && (
                <span className="block text-sm font-normal text-muted-foreground mt-0.5">
                  {appointment.pet.breed}
                </span>
              )}
            </h3>
          </div>

          {/* Información del servicio */}
          <div className="flex-1 space-y-1.5 pb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Servicio
            </p>
            <p className="text-sm font-medium leading-tight">{appointment.service.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{SERVICE_TYPE_LABELS[appointment.service.type]}</span>
              <span aria-hidden="true">•</span>
              <span>{appointment.service.durationMinutes} min</span>
            </div>
          </div>

          {/* Notas si existen */}
          {truncatedNotes && (
            <div className="space-y-1.5 pb-2 border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Notas
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {truncatedNotes}
              </p>
            </div>
          )}

          {/* Cliente si es admin */}
          {isAdmin && (
            <div className="space-y-1.5 pb-2 border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Cliente
              </p>
              <p className="text-sm font-medium">{appointment.customer.fullName}</p>
            </div>
          )}

          {/* Precio y acciones */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Precio</p>
                <p className="font-bold text-2xl tracking-tight" aria-label={`Precio: ${appointment.service.price} pesos`}>
                  ${appointment.service.price}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full sm:flex-1 text-sm h-11 sm:h-10 border-primary/20 hover:bg-primary/5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 transition-all duration-300"
                onClick={handleViewDetails}
                aria-label="Ver detalles de la cita"
              >
                Ver detalles
              </Button>
              {canCancel && (isOwner || isAdmin) && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="w-full sm:flex-1 text-sm h-11 sm:h-10 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 transition-all duration-300"
                  onClick={handleCancel}
                  disabled={cancelAppointment.isPending}
                  aria-label="Cancelar cita"
                >
                  {cancelAppointment.isPending ? 'Cancelando...' : 'Cancelar'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
