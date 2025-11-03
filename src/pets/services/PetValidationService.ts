import type { CreatePetDto } from '../types';

export class PetValidationService {
  /**
   * Valida que la fecha de nacimiento no sea futura
   */
  static validateBirthDate(birthDate: string): boolean {
    const date = new Date(birthDate);
    const now = new Date();
    return date <= now;
  }

  /**
   * Valida que el peso sea un valor razonable
   */
  static validateWeight(weight: number): boolean {
    return weight > 0 && weight <= 500; // kg
  }

  /**
   * Valida que el número de microchip tenga formato correcto (15 dígitos)
   */
  static validateMicrochip(microchip: string): boolean {
    return /^[0-9]{15}$/.test(microchip);
  }

  /**
   * Valida CreatePetDto completo
   */
  static validateCreateDto(dto: CreatePetDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateBirthDate(dto.birthDate)) {
      errors.push('La fecha de nacimiento no puede ser futura');
    }

    if (dto.weight && !this.validateWeight(dto.weight)) {
      errors.push('El peso debe estar entre 0 y 500 kg');
    }

    if (dto.microchipNumber && !this.validateMicrochip(dto.microchipNumber)) {
      errors.push('El número de microchip debe tener exactamente 15 dígitos');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
