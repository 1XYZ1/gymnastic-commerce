import type { Pet } from './pet.types';
import type { WeightSource, VisitType } from '@/shared/types/enums';

export interface WeightHistory {
  date: Date | string;
  weight: number;
  source: WeightSource;
}

/**
 * Tipos para los registros médicos en CompleteProfile
 * Flexibles para soportar datos variables del backend
 */
export interface MedicalRecord {
  id: string;
  visitDate: Date;
  visitType: VisitType;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string[];
  notes?: string;
  weightAtVisit?: number;
  temperature?: number;
  serviceCost?: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown; // Permite campos adicionales del backend
}

/**
 * Tipos para vacunaciones en CompleteProfile
 */
export interface Vaccination {
  id: string;
  vaccineName: string;
  administeredDate: Date;
  nextDueDate?: Date;
  batchNumber?: string;
  notes?: string;
  createdAt: Date;
  [key: string]: unknown; // Permite campos adicionales del backend
}

/**
 * Tipos para sesiones de grooming en CompleteProfile
 */
export interface GroomingRecord {
  id: string;
  sessionDate: Date;
  servicesPerformed: string[];
  hairStyle?: string;
  productsUsed?: string[];
  skinCondition?: string;
  coatCondition?: string;
  behaviorDuringSession?: string;
  recommendations?: string;
  durationMinutes: number; // Requerido para compatibilidad con GroomingRecord de grooming module
  serviceCost?: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown; // Permite campos adicionales del backend
}

/**
 * Tipos para citas en CompleteProfile
 * NOTA: Usa Date | string para date para máxima compatibilidad
 */
export interface Appointment {
  id: string;
  date: Date | string; // Flexible para compatibilidad
  status: string;
  notes?: string;
  pet: Pet;
  service: {
    id: string;
    name: string;
    type: string;
    [key: string]: unknown;
  };
  customer: {
    id: string;
    fullName: string;
    email: string;
    [key: string]: unknown;
  };
  createdAt: Date | string; // Flexible para compatibilidad
  updatedAt: Date | string; // Flexible para compatibilidad
  [key: string]: unknown; // Permite campos adicionales del backend
}

/**
 * CompleteProfile con tipos específicos pero flexibles
 * NOTA: Los tipos usan [key: string]: unknown para permitir campos adicionales
 * del backend mientras mantienen type safety en los campos conocidos
 */
export interface CompleteProfile {
  pet: Pet;

  medicalHistory: {
    recentVisits: MedicalRecord[];
    totalVisits: number;
  };

  vaccinations: {
    activeVaccines: Vaccination[];
    upcomingVaccines: Vaccination[];
    totalVaccines: number;
  };

  weightHistory: WeightHistory[];

  groomingHistory: {
    recentSessions: GroomingRecord[];
    totalSessions: number;
    lastSessionDate?: Date | string;
  };

  appointments: {
    upcoming: Appointment[];
    past: Appointment[];
    totalAppointments: number;
  };

  summary: {
    age: number;
    lastVisitDate?: Date | string;
    nextVaccinationDue?: Date | string;
    totalSpentMedical: number;
    totalSpentGrooming: number;
  };
}
