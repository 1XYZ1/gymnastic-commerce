export class PetAgeCalculatorService {
  /**
   * Calcula la edad de la mascota en años
   */
  static calculateAge(birthDate: Date | string | null | undefined): number {
    if (!birthDate) return 0;

    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

    // Validar que la fecha es válida
    if (isNaN(birth.getTime())) return 0;

    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Calcula la edad en meses
   */
  static calculateAgeInMonths(birthDate: Date | string | null | undefined): number {
    if (!birthDate) return 0;

    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

    // Validar que la fecha es válida
    if (isNaN(birth.getTime())) return 0;

    const today = new Date();

    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months += today.getMonth() - birth.getMonth();

    if (today.getDate() < birth.getDate()) {
      months--;
    }

    return Math.max(0, months);
  }

  /**
   * Devuelve la edad formateada (ej: "5 años", "8 meses")
   */
  static getFormattedAge(birthDate: Date | string | null | undefined): string {
    if (!birthDate) return 'Edad desconocida';

    const years = this.calculateAge(birthDate);
    const months = this.calculateAgeInMonths(birthDate);

    if (years >= 1) {
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    } else {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
  }
}
