import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';
import { useAuthStore } from '@/auth/store/auth.store';
import { useAppointment } from '../../hooks/useAppointment';
import { useAppointmentMutations } from '../../hooks/useAppointmentMutations';
import { AppointmentStatusBadge } from '../../components/AppointmentStatusBadge';
import { AppointmentValidationService } from '../../services/AppointmentValidationService';

/**
 * Página de detalle de una cita específica
 * Muestra toda la información y acciones según permisos
 */
export function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { cancelAppointment, updateAppointment } = useAppointmentMutations();

  const { data: appointment, isLoading, isError, error } = useAppointment(id!);

  const isAdmin = user?.roles.includes('admin');

  const handleCancel = () => {
    if (!appointment) return;
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      cancelAppointment.mutate(appointment.id, {
        onSuccess: () => {
          navigate('/appointments');
        },
      });
    }
  };

  const handleConfirm = async (id: string) => {
    if (!appointment) return;
    updateAppointment.mutate(
      {
        id,
        dto: { status: 'confirmed' },
      },
      {
        onSuccess: () => {
          // La página se actualizará automáticamente por React Query
        },
      }
    );
  };

  const handleComplete = async (id: string) => {
    if (!appointment) return;
    updateAppointment.mutate(
      {
        id,
        dto: { status: 'completed' },
      },
      {
        onSuccess: () => {
          // La página se actualizará automáticamente por React Query
        },
      }
    );
  };

  const handleBack = () => {
    navigate('/appointments');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Cargando detalles de la cita...</p>
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-destructive">
          Error al cargar la cita: {error instanceof Error ? error.message : 'Cita no encontrada'}
        </p>
        <div className="text-center mt-4">
          <Button onClick={handleBack} variant="outline">
            Volver a Mis Citas
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = AppointmentValidationService.formatDate(appointment.date);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          ← Volver a Mis Citas
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Detalle de Cita</h1>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información de la cita */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Fecha y hora</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mascota</p>
              <p className="font-medium">
                {appointment.petName}
                {appointment.petBreed && ` - ${appointment.petBreed}`}
              </p>
            </div>
            {appointment.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notas</p>
                <p className="text-sm">{appointment.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Creada el</p>
              <p className="text-sm">
                {new Date(appointment.createdAt).toLocaleString('es-ES')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Información del servicio */}
        <Card>
          <CardHeader>
            <CardTitle>Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointment.service.image && (
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={appointment.service.image}
                  alt={appointment.service.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-lg font-semibold">{appointment.service.name}</p>
              <p className="text-sm text-muted-foreground">
                {SERVICE_TYPE_LABELS[appointment.service.type]}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Descripción</p>
              <p className="text-sm">{appointment.service.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Duración</p>
                <p className="font-medium">{appointment.service.durationMinutes} minutos</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Precio</p>
                <p className="text-2xl font-bold">${appointment.service.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del cliente (solo admin) */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre completo</p>
                <p className="font-medium">{appointment.customer.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm">{appointment.customer.email}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones (solo admin) */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Si está pendiente: mostrar Confirmar y Cancelar */}
              {appointment.status === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleConfirm(appointment.id)}
                    disabled={updateAppointment.isPending}
                    className="flex-1"
                  >
                    {updateAppointment.isPending ? 'Confirmando...' : 'Confirmar cita'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={cancelAppointment.isPending}
                    variant="destructive"
                  >
                    {cancelAppointment.isPending ? 'Cancelando...' : 'Cancelar'}
                  </Button>
                </div>
              )}

              {/* Si está confirmada: mostrar Completar y Cancelar */}
              {appointment.status === 'confirmed' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleComplete(appointment.id)}
                    disabled={updateAppointment.isPending}
                    className="flex-1"
                  >
                    {updateAppointment.isPending ? 'Completando...' : 'Marcar como completada'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={cancelAppointment.isPending}
                    variant="destructive"
                  >
                    {cancelAppointment.isPending ? 'Cancelando...' : 'Cancelar'}
                  </Button>
                </div>
              )}

              {/* Si está completada o cancelada: solo mostrar mensaje informativo */}
              {appointment.status === 'completed' && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Esta cita ha sido completada
                </p>
              )}

              {appointment.status === 'cancelled' && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Esta cita ha sido cancelada
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
