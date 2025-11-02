import { useState } from 'react';
import { Link } from 'react-router';
import { AdminTitle } from '@/admin/components/AdminTitle';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useAdminAppointments } from '@/admin/hooks/useAdminAppointments';
import { useAppointmentMutations } from '@/appointments/hooks/useAppointmentMutations';
import { AppointmentStatusBadge } from '@/appointments/components/AppointmentStatusBadge';
import { APPOINTMENT_STATUS_CONFIG } from '@/appointments/config/appointment.config';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';
import type { AppointmentStatus } from '@/appointments/types/appointment.types';
import { Eye, X } from 'lucide-react';

/**
 * Página de administración de citas
 * Solo accesible por administradores para ver y gestionar todas las citas del sistema
 */
export function AdminAppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const { data, isLoading } = useAdminAppointments({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const { cancelAppointment, updateAppointment } = useAppointmentMutations();

  const handleCancelAppointment = (id: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      cancelAppointment.mutate(id);
    }
  };

  const handleChangeStatus = (id: string, newStatus: 'confirmed' | 'completed') => {
    updateAppointment.mutate({
      id,
      dto: { status: newStatus },
    });
  };

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle
          title="Gestión de Citas"
          subtitle="Administra todas las citas del sistema"
        />
      </div>

      {/* Filtros */}
      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="status-filter" className="text-sm font-medium">
          Filtrar por estado:
        </label>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as AppointmentStatus | 'all')}
        >
          <SelectTrigger id="status-filter" className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(APPOINTMENT_STATUS_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de citas */}
      <Table
        className="bg-white p-10 shadow-xs border border-gray-200 mb-10"
        aria-label="Tabla de citas"
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Fecha</TableHead>
            <TableHead scope="col">Cliente</TableHead>
            <TableHead scope="col">Mascota</TableHead>
            <TableHead scope="col">Servicio</TableHead>
            <TableHead scope="col">Estado</TableHead>
            <TableHead scope="col">Precio</TableHead>
            <TableHead scope="col" className="text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No hay citas registradas
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  {new Date(appointment.date).toLocaleString('es-ES', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </TableCell>
                <TableCell>{appointment.customer.fullName}</TableCell>
                <TableCell>
                  {appointment.petName}
                  {appointment.petBreed && (
                    <span className="text-muted-foreground text-xs block">
                      {appointment.petBreed}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{appointment.service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {SERVICE_TYPE_LABELS[appointment.service.type]}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <AppointmentStatusBadge status={appointment.status} />
                </TableCell>
                <TableCell className="font-semibold">${appointment.service.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Ver detalle */}
                    <Link
                      to={`/appointments/${appointment.id}`}
                      aria-label={`Ver detalle de cita para ${appointment.petName}`}
                    >
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </Link>

                    {/* Confirmar (si está pending) */}
                    {appointment.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangeStatus(appointment.id, 'confirmed')}
                        disabled={updateAppointment.isPending}
                      >
                        Confirmar
                      </Button>
                    )}

                    {/* Completar (si está confirmed) */}
                    {appointment.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangeStatus(appointment.id, 'completed')}
                        disabled={updateAppointment.isPending}
                      >
                        Completar
                      </Button>
                    )}

                    {/* Cancelar (si no está cancelled o completed) */}
                    {appointment.status !== 'cancelled' &&
                      appointment.status !== 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={cancelAppointment.isPending}
                          aria-label="Cancelar cita"
                        >
                          <X className="w-4 h-4 text-destructive" aria-hidden="true" />
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Información de paginación */}
      {data && data.data.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {data.data.length} de {data.total} citas
        </div>
      )}
    </>
  );
}
