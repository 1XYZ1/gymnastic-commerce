import type {
  MedicalRecord,
  Vaccination,
  CreateMedicalRecordDto,
  CreateVaccinationDto,
} from '../types/medical.types';
import type {
  MedicalRecordApi,
  VaccinationApi,
} from '../schemas/medical.schemas';

/**
 * Mapper para transformar datos entre API y dominio
 * Responsabilidad: Normalizar datos y convertir tipos (especialmente fechas)
 */
export class MedicalMapper {
  // ===== MEDICAL RECORDS =====

  /**
   * Transforma MedicalRecord de API a dominio
   * Convierte fechas string a Date objects
   */
  static toDomain(apiRecord: MedicalRecordApi): MedicalRecord {
    return {
      ...apiRecord,
      visitDate: apiRecord.visitDate ? new Date(apiRecord.visitDate) : apiRecord.visitDate,
      createdAt: new Date(apiRecord.createdAt),
      updatedAt: new Date(apiRecord.updatedAt),
    };
  }

  /**
   * Transforma DTO a formato API
   * Asegura que las fechas estén en formato ISO string
   */
  static toApi(dto: CreateMedicalRecordDto | Partial<CreateMedicalRecordDto>): Record<string, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      ...dto,
      // visitDate ya viene en formato "YYYY-MM-DDTHH:mm:ss" desde el formulario
    };
  }

  // ===== VACCINATIONS =====

  /**
   * Transforma Vaccination de API a dominio
   * Convierte fechas string a Date objects
   */
  static vaccinationToDomain(apiVaccine: VaccinationApi): Vaccination {
    return {
      ...apiVaccine,
      administeredDate: apiVaccine.administeredDate
        ? new Date(apiVaccine.administeredDate)
        : apiVaccine.administeredDate,
      nextDueDate: apiVaccine.nextDueDate
        ? new Date(apiVaccine.nextDueDate)
        : undefined,
      createdAt: new Date(apiVaccine.createdAt),
    };
  }

  /**
   * Transforma DTO de vacuna a formato API
   */
  static vaccinationToApi(
    dto: CreateVaccinationDto | Partial<CreateVaccinationDto>
  ): Record<string, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      ...dto,
      // administeredDate y nextDueDate ya vienen en formato "YYYY-MM-DD" desde el formulario
    };
  }
}
