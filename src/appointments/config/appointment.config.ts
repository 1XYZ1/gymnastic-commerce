import type { AppointmentStatus } from '../types/appointment.types';

export const APPOINTMENT_STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; color: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
    variant: 'outline',
  },
  confirmed: {
    label: 'Confirmada',
    color: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
    variant: 'default',
  },
  completed: {
    label: 'Completada',
    color: '',
    variant: 'secondary',
  },
  cancelled: {
    label: 'Cancelada',
    color: '',
    variant: 'destructive',
  },
};

export const BUSINESS_HOURS = {
  start: 9,  // 9:00 AM
  end: 18,   // 6:00 PM
  workDays: [1, 2, 3, 4, 5, 6] as const,  // Lunes a Sábado (0 = Domingo)
};

export const APPOINTMENTS_CONFIG = {
  pagination: {
    defaultLimit: 10,
    defaultPage: 1,
  },
} as const;
