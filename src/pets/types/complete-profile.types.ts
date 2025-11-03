import type { Pet } from './pet.types';
import type { MedicalRecord, Vaccination } from '@/medical/types/medical.types';
import type { GroomingRecord } from '@/grooming/types/grooming.types';
import type { Appointment } from '@/appointments/types/appointment.types';

// Usa el tipo Appointment completo de appointments module
type AppointmentPet = Appointment;

export interface WeightHistory {
  date: Date | string;
  weight: number;
  source: 'medical' | 'grooming' | 'manual';
}

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
    upcoming: AppointmentPet[];
    past: AppointmentPet[];
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
