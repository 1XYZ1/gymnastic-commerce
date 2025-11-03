import { gymApi } from '@/api/gymApi';
import type { Pet, CreatePetDto, UpdatePetDto, CompleteProfile } from '../types';
import type { IPetRepository } from './IPetRepository';
import { PetMapper } from '../mappers/PetMapper';
import {
  PetApiSchema,
  PetsResponseSchema,
  CompletePetProfileSchema,
} from '../schemas/pet.schemas';
import { safeValidate } from '@/lib/zod-helpers';

export class PetApiRepository implements IPetRepository {
  private readonly basePath = '/pets';

  async findAll(params?: { limit?: number; offset?: number }): Promise<Pet[]> {
    const response = await gymApi.get(this.basePath, { params });

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(PetsResponseSchema, response.data, 'PetApiRepository.findAll');

    return validated.data.map(pet => PetMapper.toDomain(pet));
  }

  async findById(id: string): Promise<Pet> {
    const { data } = await gymApi.get(`${this.basePath}/${id}`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.findById');

    return PetMapper.toDomain(validated);
  }

  async getCompleteProfile(id: string): Promise<CompleteProfile> {
    const { data } = await gymApi.get(`${this.basePath}/${id}/complete-profile`);

    // 🔍 LOGGING TEMPORAL - Verificar qué devuelve el backend
    console.group('🔍 [DEBUG] Complete Profile API Response');
    console.log('📦 Raw Data:', data);
    console.log('📋 Medical Visits:', data?.medicalHistory?.recentVisits);
    console.log('💉 Vaccinations:', data?.vaccinations?.activeVaccines);
    console.log('✨ Grooming Sessions:', data?.groomingHistory?.recentSessions);
    console.log('📅 Appointments (past):', data?.appointments?.past);
    console.log('📅 Appointments (upcoming):', data?.appointments?.upcoming);
    console.groupEnd();

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(CompletePetProfileSchema, data, 'PetApiRepository.getCompleteProfile');

    return PetMapper.completeProfileToDomain(validated);
  }

  async create(dto: CreatePetDto): Promise<Pet> {
    const payload = PetMapper.toApi(dto);
    const { data } = await gymApi.post(this.basePath, payload);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.create');

    return PetMapper.toDomain(validated);
  }

  async update(id: string, dto: UpdatePetDto): Promise<Pet> {
    const payload = PetMapper.toApi(dto);
    const { data } = await gymApi.patch(`${this.basePath}/${id}`, payload);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.update');

    return PetMapper.toDomain(validated);
  }

  async delete(id: string): Promise<{ message: string; id: string }> {
    const { data } = await gymApi.delete<{ message: string; id: string }>(`${this.basePath}/${id}`);
    return data;
  }

  async updatePhoto(id: string, file: File): Promise<Pet> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await gymApi.patch(`${this.basePath}/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.updatePhoto');

    return PetMapper.toDomain(validated);
  }

  async deletePhoto(id: string): Promise<Pet> {
    const { data } = await gymApi.delete(`${this.basePath}/${id}/photo`);

    // Validar respuesta del API con Zod (modo seguro)
    const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.deletePhoto');

    return PetMapper.toDomain(validated);
  }
}
