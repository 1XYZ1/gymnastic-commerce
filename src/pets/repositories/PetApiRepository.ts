import { gymApi } from '@/api/gymApi';
import { AxiosError } from 'axios';
import type { Pet, CreatePetDto, UpdatePetDto, CompleteProfile } from '../types';
import type { IPetRepository } from './IPetRepository';
import { PetMapper } from '../mappers/PetMapper';
import {
  PetApiSchema,
  PetsResponseSchema,
  CompletePetProfileSchema,
} from '../schemas/pet.schemas';
import { safeValidate } from '@/lib/zod-helpers';
import { getErrorMessage, logError } from '@/shared/utils/error.utils';

export class PetApiRepository implements IPetRepository {
  private readonly basePath = '/pets';

  async findAll(params?: { limit?: number; offset?: number }): Promise<Pet[]> {
    try {
      const response = await gymApi.get(this.basePath, { params });

      // Validar respuesta del API con Zod (modo seguro)
      const validated = safeValidate(PetsResponseSchema, response.data, 'PetApiRepository.findAll');

      return validated.data.map(pet => PetMapper.toDomain(pet));
    } catch (error) {
      logError(error, 'PetRepository.findAll');

      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 401) {
          throw new Error('Debes iniciar sesión para ver tus mascotas');
        }
        if (status === 403) {
          throw new Error('No tienes permiso para ver estas mascotas');
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async findById(id: string): Promise<Pet> {
    try {
      const { data } = await gymApi.get(`${this.basePath}/${id}`);

      // Validar respuesta del API con Zod (modo seguro)
      const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.findById');

      return PetMapper.toDomain(validated);
    } catch (error) {
      logError(error, 'PetRepository.findById');

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;

        if (status === 404) {
          throw new Error('Mascota no encontrada');
        }
        if (status === 403) {
          throw new Error(apiMessage || 'No tienes permiso para ver esta mascota');
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async getCompleteProfile(id: string): Promise<CompleteProfile> {
    try {
      const { data } = await gymApi.get(`${this.basePath}/${id}/complete-profile`);

      // Validar respuesta del API con Zod
      const validated = safeValidate(CompletePetProfileSchema, data, 'PetApiRepository.getCompleteProfile');

      return PetMapper.completeProfileToDomain(validated);
    } catch (error) {
      logError(error, 'PetRepository.getCompleteProfile');

      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 404) {
          throw new Error('Perfil de mascota no encontrado');
        }
        if (status === 403) {
          throw new Error('No tienes permiso para ver este perfil');
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async create(dto: CreatePetDto): Promise<Pet> {
    try {
      const payload = PetMapper.toApi(dto);
      const { data } = await gymApi.post(this.basePath, payload);

      // Validar respuesta del API con Zod (modo seguro)
      const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.create');

      return PetMapper.toDomain(validated);
    } catch (error) {
      logError(error, 'PetRepository.create');

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;

        if (status === 400) {
          throw new Error(apiMessage || 'Datos de mascota inválidos');
        }
        if (status === 409) {
          throw new Error('Ya existe una mascota con ese número de microchip');
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async update(id: string, dto: UpdatePetDto): Promise<Pet> {
    try {
      const payload = PetMapper.toApi(dto);
      const { data } = await gymApi.patch(`${this.basePath}/${id}`, payload);

      // Validar respuesta del API con Zod (modo seguro)
      const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.update');

      return PetMapper.toDomain(validated);
    } catch (error) {
      logError(error, 'PetRepository.update');

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;

        if (status === 404) {
          throw new Error('Mascota no encontrada');
        }
        if (status === 403) {
          throw new Error('No tienes permiso para editar esta mascota');
        }
        if (status === 400) {
          throw new Error(apiMessage || 'Datos de actualización inválidos');
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async delete(id: string): Promise<{ message: string; id: string }> {
    try {
      const { data } = await gymApi.delete<{ message: string; id: string }>(`${this.basePath}/${id}`);
      return data;
    } catch (error) {
      logError(error, 'PetRepository.delete');

      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 404) {
          throw new Error('Mascota no encontrada');
        }
        if (status === 403) {
          throw new Error('No tienes permiso para eliminar esta mascota');
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async updatePhoto(id: string, file: File): Promise<Pet> {
    try {
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
    } catch (error) {
      logError(error, 'PetRepository.updatePhoto');

      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;

        if (status === 400) {
          throw new Error(apiMessage || 'Formato de imagen inválido. Usa JPG, PNG o WEBP');
        }
        if (status === 413) {
          throw new Error('La imagen es demasiado grande. Máximo 5MB');
        }
        if (status === 404) {
          throw new Error('Mascota no encontrada');
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async deletePhoto(id: string): Promise<Pet> {
    try {
      const { data } = await gymApi.delete(`${this.basePath}/${id}/photo`);

      // Validar respuesta del API con Zod (modo seguro)
      const validated = safeValidate(PetApiSchema, data, 'PetApiRepository.deletePhoto');

      return PetMapper.toDomain(validated);
    } catch (error) {
      logError(error, 'PetRepository.deletePhoto');

      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 404) {
          throw new Error('Mascota o foto no encontrada');
        }
        if (status === 403) {
          throw new Error('No tienes permiso para eliminar esta foto');
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }
}
