import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminTitle } from '@/admin/components/AdminTitle';
import { AdminListItem } from '@/admin/components/AdminListItem';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
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
import { AppointmentStatusBadge } from '@/appointments/components/AppointmentStatusBadge';
import { APPOINTMENT_STATUS_CONFIG } from '@/appointments/config/appointment.config';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';
import { currencyFormatter } from '@/lib/currency-formatter';
import type { AppointmentStatus } from '@/appointments/types/appointment.types';

/**
 * Página de administración de citas
 * Solo accesible por administradores para ver y gestionar todas las citas del sistema
 *
 * Vista responsive:
 * - Desktop (>= md): Tabla con filas clickeables
 * - Móvil (< md): AdminListItem en contenedor con space-y-3
 *
 * Lista de solo lectura y navegación - todas las acciones se realizan en el detalle
 */
export function AdminAppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const { data, isLoading } = useAdminAppointments({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const navigate = useNavigate();

  // Handler para navegar al detalle de la cita
  const handleAppointmentClick = (appointmentId: string) => {
    navigate(`/appointments/${appointmentId}`);
  };

  /**
   * Formatea la fecha de la cita en formato legible
   * Ejemplo: "15/1/25, 10:30"
   */
  const formatAppointmentDate = (date: string | Date): string => {
    return new Date(date).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
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

      {/* Desktop: Tabla con filas clickeables */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay citas registradas
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    onClick={() => handleAppointmentClick(appointment.id)}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    aria-label={`Ver detalles de cita para ${appointment.petName}`}
                  >
                    <TableCell className="font-medium">
                      {formatAppointmentDate(appointment.date)}
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
                    <TableCell className="font-semibold">
                      {currencyFormatter(appointment.service.price)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Móvil: AdminListItem */}
      <div className="md:hidden space-y-3 mb-10">
        {data?.data.map((appointment) => (
          <AdminListItem
            key={appointment.id}
            onClick={() => handleAppointmentClick(appointment.id)}
            title={appointment.petName}
            subtitle={`Cliente: ${appointment.customer.fullName}`}
            badge={<AppointmentStatusBadge status={appointment.status} />}
            metadata={[
              {
                label: 'Fecha',
                value: formatAppointmentDate(appointment.date),
              },
              {
                label: 'Servicio',
                value: appointment.service.name,
              },
              {
                label: 'Precio',
                value: currencyFormatter(appointment.service.price),
              },
            ]}
          />
        ))}
      </div>

      {/* Información de paginación */}
      {data && data.data.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {data.data.length} de {data.total} citas
        </div>
      )}
    </>
  );
}
