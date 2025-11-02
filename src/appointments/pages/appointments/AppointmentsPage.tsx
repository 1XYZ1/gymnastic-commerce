import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppointmentsList } from '../../components/AppointmentsList';
import { useAppointments } from '../../hooks/useAppointments';
import { APPOINTMENT_STATUS_CONFIG } from '../../config/appointment.config';
import type { AppointmentStatus } from '../../types/appointment.types';

/**
 * Página "Mis Citas" para usuarios autenticados
 * Muestra todas las citas del usuario con filtros por estado
 */
export function AppointmentsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');

  const { data, isLoading, isError, error } = useAppointments({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const handleNewAppointment = () => {
    navigate('/appointments/new');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Citas</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus citas de servicios veterinarios y peluquería
          </p>
        </div>
        <Button onClick={handleNewAppointment} size="lg">
          Nueva Cita
        </Button>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
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
      </div>

      {/* Manejo de error */}
      {isError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-sm text-destructive font-medium mb-2">
            Error al cargar las citas
          </p>
          <p className="text-xs text-destructive/80">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      )}

      {/* Lista de citas con estados integrados */}
      {!isError && (
        <>
          <AppointmentsList appointments={data?.data ?? []} isLoading={isLoading} />

          {/* Información de paginación - solo si hay datos */}
          {data && data.data.length > 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Mostrando {data.data.length} de {data.total} citas
            </div>
          )}
        </>
      )}
    </div>
  );
}
