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
  const isOwner = user?.id === appointment?.customer.id;
  const canCancel =
    appointment &&
    appointment.status !== 'cancelled' &&
    appointment.status !== 'completed' &&
    (isOwner || isAdmin);

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

  const handleChangeStatus = (newStatus: 'pending' | 'confirmed' | 'completed') => {
    if (!appointment) return;
    updateAppointment.mutate(
      {
        id: appointment.id,
        dto: { status: newStatus },
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

        {/* Acciones */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Cambiar estado (solo admin) */}
            {isAdmin && appointment.status !== 'cancelled' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Cambiar estado:</p>
                <div className="flex flex-wrap gap-2">
                  {appointment.status !== 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChangeStatus('confirmed')}
                      disabled={updateAppointment.isPending}
                    >
                      Confirmar
                    </Button>
                  )}
                  {appointment.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChangeStatus('completed')}
                      disabled={updateAppointment.isPending}
                    >
                      Completar
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Cancelar cita */}
            {canCancel && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCancel}
                disabled={cancelAppointment.isPending}
              >
                {cancelAppointment.isPending ? 'Cancelando...' : 'Cancelar Cita'}
              </Button>
            )}

            {appointment.status === 'cancelled' && (
              <p className="text-sm text-muted-foreground text-center">
                Esta cita ha sido cancelada
              </p>
            )}

            {appointment.status === 'completed' && (
              <p className="text-sm text-muted-foreground text-center">
                Esta cita ha sido completada
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
