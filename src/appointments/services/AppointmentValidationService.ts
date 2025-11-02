import { BUSINESS_HOURS } from '../config/appointment.config';

export class AppointmentValidationService {
  /**
   * Valida si la fecha es futura
   */
  static isFutureDate(date: string): boolean {
    return new Date(date) > new Date();
  }

  /**
   * Valida si la fecha está dentro del horario de atención
   * Lunes a Sábado, 9:00 AM - 6:00 PM
   */
  static isBusinessHour(date: string): boolean {
    const d = new Date(date);
    const hour = d.getHours();
    const day = d.getDay();

    // Verificar si el día está en los días laborales (1-6)
    const isWorkDay = day >= 1 && day <= 6;

    return (
      isWorkDay &&
      hour >= BUSINESS_HOURS.start &&
      hour < BUSINESS_HOURS.end
    );
  }

  /**
   * Valida la fecha de la cita con todas las reglas de negocio
   * @returns Objeto con validez y mensaje de error si aplica
   */
  static validateAppointmentDate(date: string): { valid: boolean; error?: string } {
    if (!this.isFutureDate(date)) {
      return { valid: false, error: 'La fecha debe ser futura' };
    }

    if (!this.isBusinessHour(date)) {
      return {
        valid: false,
        error: 'Fuera de horario de atención (Lunes a Sábado, 9:00 AM - 6:00 PM)',
      };
    }

    return { valid: true };
  }

  /**
   * Formatea la fecha de forma legible en español
   */
  static formatDate(date: string): string {
    return new Date(date).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
