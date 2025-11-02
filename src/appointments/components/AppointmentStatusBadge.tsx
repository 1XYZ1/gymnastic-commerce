import { Badge } from '@/components/ui/badge';
import { APPOINTMENT_STATUS_CONFIG } from '../config/appointment.config';
import type { AppointmentStatus } from '../types/appointment.types';

interface Props {
  status: AppointmentStatus;
}

/**
 * Badge para mostrar el estado de una cita con colores apropiados
 */
export function AppointmentStatusBadge({ status }: Props) {
  const config = APPOINTMENT_STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  );
}
