import type { User } from '@/shared/types';
import type { Service } from '@/services/types/service.types';
import type { Pet } from '@/pets/types/pet.types';
import type { AppointmentStatus } from '@/shared/types/enums';

export interface Appointment {
  id: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  pet: Pet;
  service: Service;
  customer: User;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFilter {
  limit: number;
  offset: number;
  status?: AppointmentStatus;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AppointmentsResponse {
  data: Appointment[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateAppointmentDTO {
  date: string;
  serviceId: string;
  petId: string;
  notes?: string;
}

export interface UpdateAppointmentDTO {
  date?: string;
  petId?: string;
  notes?: string;
  status?: AppointmentStatus;
}

// Re-export AppointmentStatus for convenience
export type { AppointmentStatus };
