import type { GroomingRecord } from '../types/grooming.types';

/**
 * Servicio de estadísticas y lógica de negocio para grooming
 * Funciones puras sin dependencias de React
 */
export class GroomingStatsService {
  /**
   * Obtener total de sesiones de grooming
   */
  static getTotalSessions(records: GroomingRecord[]): number {
    return records.length;
  }

  /**
   * Calcular total gastado en servicios de grooming
   */
  static getTotalSpent(records: GroomingRecord[]): number {
    if (!Array.isArray(records) || records.length === 0) return 0;

    return records.reduce((total, record) => {
      const cost = typeof record.serviceCost === 'number' ? record.serviceCost : 0;
      return total + cost;
    }, 0);
  }

  /**
   * Obtener la sesión más reciente
   */
  static getMostRecentSession(records: GroomingRecord[]): GroomingRecord | null {
    if (records.length === 0) return null;

    return records.reduce((mostRecent, current) => {
      const currentDate = new Date(current.sessionDate);
      const mostRecentDate = new Date(mostRecent.sessionDate);
      return currentDate > mostRecentDate ? current : mostRecent;
    });
  }

  /**
   * Calcular duración promedio de sesiones en minutos
   */
  static getAverageDuration(records: GroomingRecord[]): number {
    if (records.length === 0) return 0;

    const totalDuration = records.reduce((sum, record) => sum + record.durationMinutes, 0);
    return Math.round(totalDuration / records.length);
  }

  /**
   * Obtener los servicios más comunes realizados
   */
  static getMostCommonServices(records: GroomingRecord[], limit: number = 5): { service: string; count: number }[] {
    // Crear mapa de frecuencias de servicios
    const serviceFrequency = new Map<string, number>();

    records.forEach((record) => {
      record.servicesPerformed.forEach((service) => {
        const trimmedService = service.trim();
        if (trimmedService) {
          const count = serviceFrequency.get(trimmedService) || 0;
          serviceFrequency.set(trimmedService, count + 1);
        }
      });
    });

    // Convertir a array y ordenar por frecuencia descendente
    const sortedServices = Array.from(serviceFrequency.entries())
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count);

    // Retornar top N
    return sortedServices.slice(0, limit);
  }

  /**
   * Ordenar registros por fecha de sesión
   */
  static sortByDate(records: GroomingRecord[], order: 'asc' | 'desc' = 'desc'): GroomingRecord[] {
    return [...records].sort((a, b) => {
      const dateA = new Date(a.sessionDate).getTime();
      const dateB = new Date(b.sessionDate).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * Filtrar registros por rango de fechas
   */
  static filterByDateRange(
    records: GroomingRecord[],
    startDate: Date,
    endDate: Date
  ): GroomingRecord[] {
    return records.filter((record) => {
      const sessionDate = new Date(record.sessionDate);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }

  /**
   * Obtener registros del último mes
   */
  static getLastMonthRecords(records: GroomingRecord[]): GroomingRecord[] {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return this.filterByDateRange(records, lastMonth, now);
  }

  /**
   * Calcular días desde la última sesión
   */
  static getDaysSinceLastSession(records: GroomingRecord[]): number | null {
    const mostRecent = this.getMostRecentSession(records);
    if (!mostRecent) return null;

    const now = new Date();
    const lastSessionDate = new Date(mostRecent.sessionDate);
    const diffTime = now.getTime() - lastSessionDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}
