import type { PetSpecies } from '@/shared/types/enums';

// Pet anidado (nested) - solo los campos que devuelve el backend
export interface PetNested {
  id: string;
  name: string;
  breed?: string;
  species?: PetSpecies;
}

export interface GroomingRecord {
  id: string;
  sessionDate: Date | string;
  servicesPerformed: string[];
  hairStyle?: string;
  productsUsed?: string[];
  skinCondition?: string;
  coatCondition?: string;
  behaviorDuringSession?: string;
  observations?: string;
  recommendations?: string;
  durationMinutes: number;
  serviceCost?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  pet?: PetNested;
  groomer?: {
    id: string;
    fullName: string;
  };
}

export interface CreateGroomingRecordDto {
  petId: string;
  sessionDate: string; // Format: "YYYY-MM-DDTHH:mm:ss"
  servicesPerformed: string[];
  hairStyle?: string;
  productsUsed?: string[];
  skinCondition?: string;
  coatCondition?: string;
  behaviorDuringSession?: string;
  observations?: string;
  recommendations?: string;
  durationMinutes: number; // Campo requerido
  serviceCost?: number;
}
