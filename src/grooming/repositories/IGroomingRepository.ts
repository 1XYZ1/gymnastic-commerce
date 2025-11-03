import type { GroomingRecord, CreateGroomingRecordDto } from '../types';

/**
 * Interface del repositorio de registros de grooming
 * Dependency Inversion Principle - Los servicios dependen de esta interfaz, no de la implementación
 */
export interface IGroomingRepository {
  /**
   * Obtener historial de grooming de una mascota
   */
  findByPetId(petId: string): Promise<GroomingRecord[]>;

  /**
   * Obtener registro de grooming específico por ID
   */
  findById(id: string): Promise<GroomingRecord>;

  /**
   * Crear nuevo registro de grooming
   */
  create(dto: CreateGroomingRecordDto): Promise<GroomingRecord>;

  /**
   * Actualizar registro de grooming existente
   */
  update(id: string, dto: Partial<CreateGroomingRecordDto>): Promise<GroomingRecord>;

  /**
   * Eliminar registro de grooming
   */
  delete(id: string): Promise<{ message: string; id: string }>;
}
