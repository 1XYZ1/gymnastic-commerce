import type { AxiosInstance } from 'axios';
import type { IAppointmentRepository } from './IAppointmentRepository';
import type {
  Appointment,
  AppointmentFilter,
  AppointmentsResponse,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../types/appointment.types';
import type { AppointmentsApiResponse, DeleteApiResponse } from '@/shared/types';
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
    const { data } = await this.api.get<AppointmentsApiResponse>('/appointments', {
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
    const { data } = await this.api.get<AppointmentsApiResponse>(`/appointments/${id}`);
    // getById retorna un objeto directamente, no un array
    return this.mapper.toDomain(data as unknown as Parameters<typeof AppointmentMapper.toDomain>[0]);
  }

  async createAppointment(dto: CreateAppointmentDTO): Promise<Appointment> {
    const { data } = await this.api.post<AppointmentsApiResponse>('/appointments', dto);
    return this.mapper.toDomain(data as unknown as Parameters<typeof AppointmentMapper.toDomain>[0]);
  }

  async updateAppointment(id: string, dto: UpdateAppointmentDTO): Promise<Appointment> {
    const { data } = await this.api.patch<AppointmentsApiResponse>(`/appointments/${id}`, dto);
    return this.mapper.toDomain(data as unknown as Parameters<typeof AppointmentMapper.toDomain>[0]);
  }

  async cancelAppointment(id: string): Promise<Appointment> {
    const { data } = await this.api.delete<DeleteApiResponse>(`/appointments/${id}`);
    // Delete endpoint retorna { appointment: {...} }
    return this.mapper.toDomain(data.appointment as unknown as Parameters<typeof AppointmentMapper.toDomain>[0]);
  }
}
