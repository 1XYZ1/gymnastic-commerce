import type {
  Appointment,
  AppointmentFilter,
  AppointmentsResponse,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../types/appointment.types';

/**
 * Interfaz del repositorio de citas (Dependency Inversion Principle)
 * Define el contrato para el acceso a datos de citas
 */
export interface IAppointmentRepository {
  /**
   * Obtiene lista paginada de citas con filtros opcionales
   */
  getAppointments(filter: AppointmentFilter): Promise<AppointmentsResponse>;

  /**
   * Obtiene una cita específica por su ID
   */
  getAppointmentById(id: string): Promise<Appointment>;

  /**
   * Crea una nueva cita
   */
  createAppointment(dto: CreateAppointmentDTO): Promise<Appointment>;

  /**
   * Actualiza una cita existente
   */
  updateAppointment(id: string, dto: UpdateAppointmentDTO): Promise<Appointment>;

  /**
   * Cancela una cita (cambia status a 'cancelled')
   */
  cancelAppointment(id: string): Promise<Appointment>;
}
