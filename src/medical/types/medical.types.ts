import type { VisitType, PetSpecies } from '@/shared/types/enums';

// Pet anidado (nested) - solo los campos que devuelve el backend
export interface PetNested {
  id: string;
  name: string;
  breed?: string;
  species?: PetSpecies;
}

export interface MedicalRecord {
  id: string;
  visitDate: Date | string;
  visitType: VisitType;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  weightAtVisit?: number;
  temperature?: number;
  serviceCost?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  pet?: PetNested;
  veterinarian?: {
    id: string;
    fullName: string;
    email?: string;
  };
}

export interface Vaccination {
  id: string;
  vaccineName: string;
  administeredDate: Date | string;
  nextDueDate?: Date | string;
  batchNumber?: string;
  notes?: string;
  createdAt: Date | string;
  pet?: PetNested;
  veterinarian?: {
    id: string;
    fullName: string;
  };
}

export interface CreateMedicalRecordDto {
  petId: string;
  visitDate: string; // Format: "YYYY-MM-DDTHH:mm:ss"
  visitType: VisitType;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  weightAtVisit?: number;
  temperature?: number;
  serviceCost?: number;
}

export interface CreateVaccinationDto {
  petId: string;
  vaccineName: string;
  administeredDate: string; // Format: "YYYY-MM-DD"
  nextDueDate?: string;
  batchNumber?: string;
  notes?: string;
}
