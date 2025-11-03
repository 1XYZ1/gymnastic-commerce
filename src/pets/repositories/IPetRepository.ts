import type { Pet, CreatePetDto, UpdatePetDto, CompleteProfile } from '../types';

export interface IPetRepository {
  // Listar mascotas (con paginación)
  findAll(params?: { limit?: number; offset?: number }): Promise<Pet[]>;

  // Obtener mascota por ID
  findById(id: string): Promise<Pet>;

  // Obtener perfil completo
  getCompleteProfile(id: string): Promise<CompleteProfile>;

  // Crear mascota
  create(data: CreatePetDto): Promise<Pet>;

  // Actualizar mascota
  update(id: string, data: UpdatePetDto): Promise<Pet>;

  // Eliminar (soft delete)
  delete(id: string): Promise<{ message: string; id: string }>;

  // Actualizar foto de perfil
  updatePhoto(id: string, file: File): Promise<Pet>;

  // Eliminar foto de perfil
  deletePhoto(id: string): Promise<Pet>;
}
