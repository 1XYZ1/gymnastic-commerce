import { gymApi } from '@/api/gymApi';
import { z } from 'zod';
import type { GroomingRecord, CreateGroomingRecordDto } from '../types/grooming.types';
import type { IGroomingRepository } from './IGroomingRepository';
import { GroomingMapper } from '../mappers/GroomingMapper';
import { GroomingRecordApiSchema } from '../schemas/grooming.schemas';
import { safeValidate } from '@/lib/zod-helpers';

/**
 * Implementación del repositorio de registros de grooming usando API REST
 * Dependency Injection: Usa gymApi que ya tiene configurado el token automáticamente
 */
export class GroomingApiRepository implements IGroomingRepository {
  private readonly basePath = '/grooming-records';

  /**
   * Obtener historial de grooming de una mascota
   */
  async findByPetId(petId: string): Promise<GroomingRecord[]> {
    const { data } = await gymApi.get(`${this.basePath}/pet/${petId}`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(z.array(GroomingRecordApiSchema), data, 'GroomingApiRepository.findByPetId');

    return validated.map((record) => GroomingMapper.toDomain(record));
  }

  /**
   * Obtener registro de grooming específico por ID
   */
  async findById(id: string): Promise<GroomingRecord> {
    const { data } = await gymApi.get(`${this.basePath}/${id}`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(GroomingRecordApiSchema, data, 'GroomingApiRepository.findById');

    return GroomingMapper.toDomain(validated);
  }

  /**
   * Crear nuevo registro de grooming
   */
  async create(dto: CreateGroomingRecordDto): Promise<GroomingRecord> {
    const payload = GroomingMapper.toApi(dto);
    const { data } = await gymApi.post(this.basePath, payload);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(GroomingRecordApiSchema, data, 'GroomingApiRepository.create');

    return GroomingMapper.toDomain(validated);
  }

  /**
   * Actualizar registro de grooming existente
   */
  async update(id: string, dto: Partial<CreateGroomingRecordDto>): Promise<GroomingRecord> {
    const payload = GroomingMapper.toApi(dto);
    const { data } = await gymApi.patch(`${this.basePath}/${id}`, payload);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(GroomingRecordApiSchema, data, 'GroomingApiRepository.update');

    return GroomingMapper.toDomain(validated);
  }

  /**
   * Eliminar registro de grooming
   */
  async delete(id: string): Promise<{ message: string; id: string }> {
    const { data } = await gymApi.delete<{ message: string; id: string }>(
      `${this.basePath}/${id}`
    );
    return data;
  }
}
