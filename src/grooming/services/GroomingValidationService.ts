import type { CreateGroomingRecordDto } from '../types/grooming.types';

/**
 * Servicio de validación para registros de grooming
 * Lógica de negocio pura sin dependencias de React
 */
export class GroomingValidationService {
  // Constantes de validación
  private static readonly MIN_DURATION = 0; // minutos
  private static readonly MAX_DURATION = 480; // 8 horas
  private static readonly MIN_COST = 0;

  /**
   * Valida que la fecha de sesión no sea futura
   */
  static validateSessionDate(sessionDate: string): boolean {
    const date = new Date(sessionDate);
    const now = new Date();
    return date <= now;
  }

  /**
   * Valida rango de duración (0-480 minutos)
   */
  static validateDuration(durationMinutes: number): boolean {
    return durationMinutes > this.MIN_DURATION && durationMinutes <= this.MAX_DURATION;
  }

  /**
   * Valida que el costo sea positivo o cero
   */
  static validateCost(serviceCost: number): boolean {
    return serviceCost >= this.MIN_COST;
  }

  /**
   * Valida que haya al menos un servicio realizado
   */
  static validateServicesPerformed(services: string[]): boolean {
    return services.length > 0 && services.every((service) => service.trim() !== '');
  }

  /**
   * Valida CreateGroomingRecordDto completo
   */
  static validateCreateDto(dto: CreateGroomingRecordDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Campos requeridos
    if (!dto.petId) {
      errors.push('El ID de la mascota es requerido');
    }

    if (!dto.sessionDate) {
      errors.push('La fecha de sesión es requerida');
    } else if (!this.validateSessionDate(dto.sessionDate)) {
      errors.push('La fecha de sesión no puede ser futura');
    }

    if (!dto.servicesPerformed || dto.servicesPerformed.length === 0) {
      errors.push('Debe incluir al menos un servicio realizado');
    } else if (!this.validateServicesPerformed(dto.servicesPerformed)) {
      errors.push('Los servicios realizados no pueden estar vacíos');
    }

    if (!dto.durationMinutes) {
      errors.push('La duración de la sesión es requerida');
    } else if (!this.validateDuration(dto.durationMinutes)) {
      errors.push(`La duración debe ser mayor a 0 y menor o igual a ${this.MAX_DURATION} minutos (8 horas)`);
    }

    // Campos opcionales
    if (dto.serviceCost !== undefined && !this.validateCost(dto.serviceCost)) {
      errors.push('El costo del servicio no puede ser negativo');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
