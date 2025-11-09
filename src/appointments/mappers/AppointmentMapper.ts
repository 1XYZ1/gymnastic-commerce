import type { Appointment, AppointmentsResponse, AppointmentStatus } from '../types/appointment.types';
import type { AppointmentsApiResponse } from '@/shared/types';
import type { Pet } from '@/pets/types';
import type { Service } from '@/services/types/service.types';
import type { User } from '@/shared/types';

/**
 * Estructura de una cita en formato API
 */
interface AppointmentApiData {
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

/**
 * Mapper para transformar datos de la API a modelos de dominio
 */
export class AppointmentMapper {
  /**
   * Transforma una cita de la API al modelo de dominio
   */
  static toDomain(apiAppointment: AppointmentApiData): Appointment {
    return {
      id: apiAppointment.id,
      date: apiAppointment.date,
      status: apiAppointment.status,
      notes: apiAppointment.notes,
      pet: apiAppointment.pet,
      service: apiAppointment.service,
      customer: apiAppointment.customer,
      createdAt: apiAppointment.createdAt,
      updatedAt: apiAppointment.updatedAt,
    };
  }

  /**
   * Transforma la respuesta paginada de la API al modelo de dominio
   */
  static toDomainList(apiResponse: AppointmentsApiResponse): AppointmentsResponse {
    // El backend puede devolver { appointments: [...] } o { data: [...] }
    // Soportamos ambos formatos
    const items = (apiResponse.appointments || apiResponse.data || []) as AppointmentApiData[];

    return {
      data: items.map((item) => this.toDomain(item)),
      total: apiResponse.total ?? 0,
      limit: apiResponse.limit ?? 10,
      offset: apiResponse.offset ?? 0,
    };
  }
}
