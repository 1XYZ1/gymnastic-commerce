import type { Appointment, AppointmentsResponse } from '../types/appointment.types';

/**
 * Mapper para transformar datos de la API a modelos de dominio
 */
export class AppointmentMapper {
  /**
   * Transforma una cita de la API al modelo de dominio
   */
  static toDomain(apiAppointment: any): Appointment {
    return {
      id: apiAppointment.id,
      date: apiAppointment.date,
      status: apiAppointment.status,
      notes: apiAppointment.notes,
      petName: apiAppointment.petName,
      petBreed: apiAppointment.petBreed,
      service: apiAppointment.service,
      customer: apiAppointment.customer,
      createdAt: apiAppointment.createdAt,
      updatedAt: apiAppointment.updatedAt,
    };
  }

  /**
   * Transforma la respuesta paginada de la API al modelo de dominio
   */
  static toDomainList(apiResponse: any): AppointmentsResponse {
    // El backend puede devolver { appointments: [...] } o { data: [...] }
    // Soportamos ambos formatos
    return {
      data: (apiResponse.appointments || apiResponse.data || []).map((item: any) => this.toDomain(item)),
      total: apiResponse.total ?? 0,
      limit: apiResponse.limit ?? 10,
      offset: apiResponse.offset ?? 0,
    };
  }
}
