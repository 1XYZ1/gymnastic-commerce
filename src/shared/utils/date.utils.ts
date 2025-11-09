/**
 * Utilidades compartidas para formateo y manipulación de fechas
 *
 * Centraliza todas las operaciones de fechas usando date-fns
 * para mantener consistencia en toda la aplicación
 */

import { format, parseISO, isValid, isAfter, differenceInYears, differenceInMonths } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha a formato legible en español
 * Ejemplo: "15 de noviembre de 2024"
 */
export function formatDateLong(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    console.warn('Invalid date provided to formatDateLong:', date);
    return 'Fecha inválida';
  }

  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Formatea una fecha a formato corto
 * Ejemplo: "15/11/2024"
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    console.warn('Invalid date provided to formatDateShort:', date);
    return 'Fecha inválida';
  }

  return format(dateObj, 'dd/MM/yyyy');
}

/**
 * Formatea una fecha a formato PPP (predefined format)
 * Ejemplo: "15 de noviembre de 2024"
 */
export function formatDatePPP(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    console.warn('Invalid date provided to formatDatePPP:', date);
    return 'Fecha inválida';
  }

  return format(dateObj, 'PPP', { locale: es });
}

/**
 * Formatea una fecha con hora
 * Ejemplo: "15/11/2024 14:30"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    console.warn('Invalid date provided to formatDateTime:', date);
    return 'Fecha inválida';
  }

  return format(dateObj, "dd/MM/yyyy 'a las' HH:mm", { locale: es });
}

/**
 * Formatea una fecha para inputs tipo date (YYYY-MM-DD)
 */
export function formatDateForInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    console.warn('Invalid date provided to formatDateForInput:', date);
    return '';
  }

  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Valida que una fecha no sea futura
 */
export function isNotFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return false;
  }

  return !isAfter(dateObj, new Date());
}

/**
 * Valida que una fecha sea futura
 */
export function isFutureDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return false;
  }

  return isAfter(dateObj, new Date());
}

/**
 * Calcula la edad en años desde una fecha de nacimiento
 */
export function calculateAge(birthDate: string | Date): number {
  const dateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;

  if (!isValid(dateObj)) {
    console.warn('Invalid date provided to calculateAge:', birthDate);
    return 0;
  }

  return differenceInYears(new Date(), dateObj);
}

/**
 * Calcula la diferencia en meses entre dos fechas
 */
export function monthsBetween(startDate: string | Date, endDate: string | Date): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  if (!isValid(start) || !isValid(end)) {
    console.warn('Invalid date provided to monthsBetween');
    return 0;
  }

  return differenceInMonths(end, start);
}

/**
 * Valida si una cadena es una fecha ISO válida
 */
export function isValidISODate(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
}

/**
 * Formatea una fecha de forma segura, retornando un fallback si es inválida
 */
export function safeDateFormat(
  date: string | Date | null | undefined,
  formatFn: (date: Date) => string = formatDateLong,
  fallback: string = 'No disponible'
): string {
  if (!date) return fallback;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return fallback;
    return formatFn(dateObj);
  } catch {
    return fallback;
  }
}
