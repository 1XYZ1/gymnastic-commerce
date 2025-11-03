import { gymApi } from '@/api/gymApi';
import { z } from 'zod';
import type {
  MedicalRecord,
  Vaccination,
  CreateMedicalRecordDto,
  CreateVaccinationDto,
} from '../types/medical.types';
import type { IMedicalRepository } from './IMedicalRepository';
import { MedicalMapper } from '../mappers/MedicalMapper';
import {
  MedicalRecordApiSchema,
  VaccinationApiSchema,
} from '../schemas/medical.schemas';
import { safeValidate } from '@/lib/zod-helpers';

/**
 * Implementaci�n del repositorio de registros m�dicos usando API REST
 * Dependency Injection: Usa gymApi que ya tiene configurado el token autom�ticamente
 */
export class MedicalApiRepository implements IMedicalRepository {
  private readonly basePath = '/medical-records';

  // ===== MEDICAL RECORDS =====

  /**
   * Obtener historial m�dico de una mascota
   */
  async findByPetId(petId: string): Promise<MedicalRecord[]> {
    const { data } = await gymApi.get(`${this.basePath}/pet/${petId}`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(z.array(MedicalRecordApiSchema), data, 'MedicalApiRepository.findByPetId');

    return validated.map((record) => MedicalMapper.toDomain(record));
  }

  /**
   * Obtener registro m�dico espec�fico por ID
   */
  async findById(id: string): Promise<MedicalRecord> {
    const { data } = await gymApi.get(`${this.basePath}/${id}`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(MedicalRecordApiSchema, data, 'MedicalApiRepository.findById');

    return MedicalMapper.toDomain(validated);
  }

  /**
   * Crear nuevo registro m�dico
   */
  async create(dto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const payload = MedicalMapper.toApi(dto);
    const { data } = await gymApi.post(this.basePath, payload);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(MedicalRecordApiSchema, data, 'MedicalApiRepository.create');

    return MedicalMapper.toDomain(validated);
  }

  /**
   * Actualizar registro m�dico existente
   */
  async update(id: string, dto: Partial<CreateMedicalRecordDto>): Promise<MedicalRecord> {
    const payload = MedicalMapper.toApi(dto);
    const { data } = await gymApi.patch(`${this.basePath}/${id}`, payload);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(MedicalRecordApiSchema, data, 'MedicalApiRepository.update');

    return MedicalMapper.toDomain(validated);
  }

  /**
   * Eliminar registro m�dico
   */
  async delete(id: string): Promise<{ message: string; id: string }> {
    const { data } = await gymApi.delete<{ message: string; id: string }>(
      `${this.basePath}/${id}`
    );
    return data;
  }

  // ===== VACCINATIONS =====

  /**
   * Crear nuevo registro de vacuna
   */
  async createVaccination(dto: CreateVaccinationDto): Promise<Vaccination> {
    const payload = MedicalMapper.vaccinationToApi(dto);
    const { data } = await gymApi.post(`${this.basePath}/vaccinations`, payload);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(VaccinationApiSchema, data, 'MedicalApiRepository.createVaccination');

    return MedicalMapper.vaccinationToDomain(validated);
  }

  /**
   * Obtener vacunas de una mascota
   */
  async findVaccinationsByPetId(petId: string): Promise<Vaccination[]> {
    const { data } = await gymApi.get(`${this.basePath}/vaccinations/pet/${petId}`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(z.array(VaccinationApiSchema), data, 'MedicalApiRepository.findVaccinationsByPetId');

    return validated.map((vaccine) => MedicalMapper.vaccinationToDomain(vaccine));
  }

  /**
   * Obtener vacuna espec�fica por ID
   */
  async findVaccinationById(id: string): Promise<Vaccination> {
    const { data } = await gymApi.get(`${this.basePath}/vaccinations/${id}`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(VaccinationApiSchema, data, 'MedicalApiRepository.findVaccinationById');

    return MedicalMapper.vaccinationToDomain(validated);
  }

  /**
   * Actualizar registro de vacuna
   */
  async updateVaccination(
    id: string,
    dto: Partial<CreateVaccinationDto>
  ): Promise<Vaccination> {
    const payload = MedicalMapper.vaccinationToApi(dto);
    const { data } = await gymApi.patch(`${this.basePath}/vaccinations/${id}`, payload);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(VaccinationApiSchema, data, 'MedicalApiRepository.updateVaccination');

    return MedicalMapper.vaccinationToDomain(validated);
  }

  /**
   * Eliminar registro de vacuna
   */
  async deleteVaccination(id: string): Promise<{ message: string; id: string }> {
    const { data } = await gymApi.delete<{ message: string; id: string }>(
      `${this.basePath}/vaccinations/${id}`
    );
    return data;
  }

  /**
   * Obtener vacunas pr�ximas a vencer (solo admin)
   * Endpoint: GET /api/medical-records/vaccinations/due
   */
  async findVaccinationsDue(): Promise<Vaccination[]> {
    const { data } = await gymApi.get(`${this.basePath}/vaccinations/due`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(z.array(VaccinationApiSchema), data, 'MedicalApiRepository.findVaccinationsDue');

    return validated.map((vaccine) => MedicalMapper.vaccinationToDomain(vaccine));
  }
}
