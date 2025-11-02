import type { AxiosInstance } from 'axios';
import type { IAppointmentRepository } from './IAppointmentRepository';
import type {
  Appointment,
  AppointmentFilter,
  AppointmentsResponse,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../types/appointment.types';
import { AppointmentMapper } from '../mappers/AppointmentMapper';

/**
 * Implementación del repositorio de citas usando la API REST
 * Abstrae el acceso a datos y delega la transformación al mapper
 */
export class AppointmentApiRepository implements IAppointmentRepository {
  private api: AxiosInstance;
  private mapper: typeof AppointmentMapper;

  constructor(api: AxiosInstance, mapper: typeof AppointmentMapper) {
    this.api = api;
    this.mapper = mapper;
  }

  async getAppointments(filter: AppointmentFilter): Promise<AppointmentsResponse> {
    const { data } = await this.api.get<any>('/appointments', {
      params: {
        limit: filter.limit,
        offset: filter.offset,
        status: filter.status,
        serviceId: filter.serviceId,
        dateFrom: filter.dateFrom,
        dateTo: filter.dateTo,
      },
    });
    return this.mapper.toDomainList(data);
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const { data } = await this.api.get<any>(`/appointments/${id}`);
    return this.mapper.toDomain(data);
  }

  async createAppointment(dto: CreateAppointmentDTO): Promise<Appointment> {
    const { data } = await this.api.post<any>('/appointments', dto);
    return this.mapper.toDomain(data);
  }

  async updateAppointment(id: string, dto: UpdateAppointmentDTO): Promise<Appointment> {
    const { data } = await this.api.patch<any>(`/appointments/${id}`, dto);
    return this.mapper.toDomain(data);
  }

  async cancelAppointment(id: string): Promise<Appointment> {
    const { data } = await this.api.delete<any>(`/appointments/${id}`);
    return this.mapper.toDomain(data.appointment);
  }
}
