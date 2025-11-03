import type { PetSpecies, PetGender, PetTemperament } from '@/shared/types/enums';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate: Date | string;
  gender: PetGender;
  color?: string;
  weight?: number;
  microchipNumber?: string;
  profilePhoto?: string;
  temperament: PetTemperament;
  behaviorNotes: string[];
  generalNotes?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  owner?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CreatePetDto {
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate: string; // Format: "YYYY-MM-DD"
  gender: PetGender;
  color?: string;
  weight?: number;
  microchipNumber?: string;
  temperament?: PetTemperament;
  behaviorNotes?: string[];
  generalNotes?: string;
}

export interface UpdatePetDto {
  name?: string;
  breed?: string;
  color?: string;
  weight?: number | null;
  microchipNumber?: string;
  temperament?: PetTemperament;
  behaviorNotes?: string[];
  generalNotes?: string;
}
