import type { CreateMedicalRecordDto, CreateVaccinationDto } from '../types/medical.types';
import { VisitType } from '@/shared/types/enums';

/**
 * Servicio de validación para registros médicos
 * Lógica de negocio pura sin dependencias de React
 */
export class MedicalValidationService {
  // Constantes de validación
  private static readonly MIN_TEMPERATURE = 35; // °C
  private static readonly MAX_TEMPERATURE = 42; // °C
  private static readonly MIN_WEIGHT = 0; // kg
  private static readonly MAX_WEIGHT = 500; // kg

  /**
   * Valida que la fecha de visita no sea futura
   */
  static validateVisitDate(visitDate: string): boolean {
    const date = new Date(visitDate);
    const now = new Date();
    return date <= now;
  }

  /**
   * Valida rango de temperatura (35-42°C)
   */
  static validateTemperature(temperature: number): boolean {
    return temperature >= this.MIN_TEMPERATURE && temperature <= this.MAX_TEMPERATURE;
  }

  /**
   * Valida rango de peso (> 0 kg)
   */
  static validateWeight(weight: number): boolean {
    return weight > this.MIN_WEIGHT && weight <= this.MAX_WEIGHT;
  }

  /**
   * Valida que el tipo de visita sea válido
   */
  static validateVisitType(visitType: string): boolean {
    return Object.values(VisitType).includes(visitType as VisitType);
  }

  /**
   * Valida campos requeridos de CreateMedicalRecordDto
   */
  static validateRequiredFields(dto: CreateMedicalRecordDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dto.petId) {
      errors.push('El ID de la mascota es requerido');
    }

    if (!dto.visitDate) {
      errors.push('La fecha de visita es requerida');
    } else if (!this.validateVisitDate(dto.visitDate)) {
      errors.push('La fecha de visita no puede ser futura');
    }

    if (!dto.visitType) {
      errors.push('El tipo de visita es requerido');
    } else if (!this.validateVisitType(dto.visitType)) {
      errors.push('El tipo de visita no es válido');
    }

    if (!dto.reason || dto.reason.trim() === '') {
      errors.push('El motivo de la consulta es requerido');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida campos opcionales de CreateMedicalRecordDto
   */
  static validateOptionalFields(dto: CreateMedicalRecordDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (dto.temperature !== undefined && !this.validateTemperature(dto.temperature)) {
      errors.push(`La temperatura debe estar entre ${this.MIN_TEMPERATURE}°C y ${this.MAX_TEMPERATURE}°C`);
    }

    if (dto.weightAtVisit !== undefined && !this.validateWeight(dto.weightAtVisit)) {
      errors.push(`El peso debe ser mayor a 0 kg y menor a ${this.MAX_WEIGHT} kg`);
    }

    if (dto.serviceCost !== undefined && dto.serviceCost < 0) {
      errors.push('El costo del servicio no puede ser negativo');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida CreateMedicalRecordDto completo
   */
  static validateCreateDto(dto: CreateMedicalRecordDto): { valid: boolean; errors: string[] } {
    const requiredValidation = this.validateRequiredFields(dto);
    const optionalValidation = this.validateOptionalFields(dto);

    return {
      valid: requiredValidation.valid && optionalValidation.valid,
      errors: [...requiredValidation.errors, ...optionalValidation.errors],
    };
  }

  /**
   * Valida CreateVaccinationDto
   */
  static validateVaccinationDto(dto: CreateVaccinationDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dto.petId) {
      errors.push('El ID de la mascota es requerido');
    }

    if (!dto.vaccineName || dto.vaccineName.trim() === '') {
      errors.push('El nombre de la vacuna es requerido');
    }

    if (!dto.administeredDate) {
      errors.push('La fecha de administración es requerida');
    } else if (!this.validateVisitDate(dto.administeredDate)) {
      errors.push('La fecha de administración no puede ser futura');
    }

    // Si hay nextDueDate, debe ser posterior a administeredDate
    if (dto.administeredDate && dto.nextDueDate) {
      const adminDate = new Date(dto.administeredDate);
      const dueDate = new Date(dto.nextDueDate);

      if (dueDate <= adminDate) {
        errors.push('La fecha de vencimiento debe ser posterior a la fecha de administración');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
