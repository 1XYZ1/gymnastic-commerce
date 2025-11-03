import type { Vaccination } from '../types/medical.types';

/**
 * Servicio de lógica de negocio para vacunas
 * Funciones puras sin dependencias de React
 */
export class VaccinationService {
  // Constantes de negocio
  private static readonly DAYS_BEFORE_DUE_WARNING = 30; // días

  /**
   * Detecta vacunas próximas a vencer (dentro de los próximos 30 días)
   */
  static getUpcomingVaccinations(vaccinations: Vaccination[]): Vaccination[] {
    const now = new Date();
    const warningDate = new Date();
    warningDate.setDate(now.getDate() + this.DAYS_BEFORE_DUE_WARNING);

    return vaccinations.filter((vaccine) => {
      if (!vaccine.nextDueDate) return false;

      const dueDate = new Date(vaccine.nextDueDate);
      return dueDate >= now && dueDate <= warningDate;
    });
  }

  /**
   * Detecta vacunas ya vencidas
   */
  static getOverdueVaccinations(vaccinations: Vaccination[]): Vaccination[] {
    const now = new Date();

    return vaccinations.filter((vaccine) => {
      if (!vaccine.nextDueDate) return false;

      const dueDate = new Date(vaccine.nextDueDate);
      return dueDate < now;
    });
  }

  /**
   * Calcula días restantes hasta el vencimiento de una vacuna
   * Retorna número positivo si aún no vence, negativo si ya venció
   */
  static getDaysUntilDue(vaccination: Vaccination): number | null {
    if (!vaccination.nextDueDate) return null;

    const now = new Date();
    const dueDate = new Date(vaccination.nextDueDate);

    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Determina el estado de una vacuna basado en su fecha de vencimiento
   * - 'current': Vigente (vence en más de 30 días)
   * - 'upcoming': Próxima a vencer (vence en 30 días o menos)
   * - 'overdue': Vencida
   * - 'no-due-date': Sin fecha de vencimiento
   */
  static getVaccinationStatus(
    vaccination: Vaccination
  ): 'current' | 'upcoming' | 'overdue' | 'no-due-date' {
    if (!vaccination.nextDueDate) return 'no-due-date';

    const daysUntilDue = this.getDaysUntilDue(vaccination);

    if (daysUntilDue === null) return 'no-due-date';
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= this.DAYS_BEFORE_DUE_WARNING) return 'upcoming';
    return 'current';
  }

  /**
   * Ordena vacunas por fecha de vencimiento (próximas primero)
   */
  static sortByDueDate(vaccinations: Vaccination[]): Vaccination[] {
    return [...vaccinations].sort((a, b) => {
      // Vacunas sin fecha de vencimiento van al final
      if (!a.nextDueDate && !b.nextDueDate) return 0;
      if (!a.nextDueDate) return 1;
      if (!b.nextDueDate) return -1;

      const dateA = new Date(a.nextDueDate);
      const dateB = new Date(b.nextDueDate);

      return dateA.getTime() - dateB.getTime();
    });
  }

  /**
   * Filtra vacunas activas (que tienen fecha de próxima aplicación)
   */
  static getActiveVaccinations(vaccinations: Vaccination[]): Vaccination[] {
    return vaccinations.filter((vaccine) => vaccine.nextDueDate !== undefined);
  }

  /**
   * Valida fechas de vacuna
   */
  static validateVaccinationDates(administeredDate: string, nextDueDate?: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Fecha de administración no puede ser futura
    const adminDate = new Date(administeredDate);
    const now = new Date();

    if (adminDate > now) {
      errors.push('La fecha de administración no puede ser futura');
    }

    // Si hay nextDueDate, debe ser posterior a administeredDate
    if (nextDueDate) {
      const dueDate = new Date(nextDueDate);

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
