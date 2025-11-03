import type { GroomingRecord, CreateGroomingRecordDto } from '../types/grooming.types';
import type { GroomingRecordApi } from '../schemas/grooming.schemas';

/**
 * Mapper para transformar datos entre API y dominio
 * Responsabilidad: Normalizar datos y convertir tipos (especialmente fechas)
 */
export class GroomingMapper {
  /**
   * Transforma GroomingRecord de API a dominio
   * Convierte fechas string a Date objects
   */
  static toDomain(apiRecord: GroomingRecordApi): GroomingRecord {
    return {
      ...apiRecord,
      sessionDate: apiRecord.sessionDate ? new Date(apiRecord.sessionDate) : apiRecord.sessionDate,
      createdAt: new Date(apiRecord.createdAt),
      updatedAt: new Date(apiRecord.updatedAt),
    };
  }

  /**
   * Transforma DTO a formato API
   * Asegura que las fechas estén en formato ISO string
   */
  static toApi(dto: CreateGroomingRecordDto | Partial<CreateGroomingRecordDto>): Record<string, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      ...dto,
      // sessionDate ya viene en formato "YYYY-MM-DDTHH:mm:ss" desde el formulario
    };
  }
}
