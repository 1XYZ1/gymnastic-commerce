export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other';

export type PetGender = 'male' | 'female' | 'unknown';

export type PetTemperament = 'friendly' | 'aggressive' | 'shy' | 'playful' | 'calm' | 'energetic' | 'nervous' | 'unknown';

export type VisitType = 'consultation' | 'vaccination' | 'surgery' | 'emergency' | 'checkup' | 'other';

export type AppointmentPetStatus = 'pending' | 'completed' | 'cancelled';

// Constants for easy access
export const PetSpecies = {
  DOG: 'dog' as const,
  CAT: 'cat' as const,
  BIRD: 'bird' as const,
  RABBIT: 'rabbit' as const,
  HAMSTER: 'hamster' as const,
  FISH: 'fish' as const,
  REPTILE: 'reptile' as const,
  OTHER: 'other' as const,
} as const;

export const PetGender = {
  MALE: 'male' as const,
  FEMALE: 'female' as const,
  UNKNOWN: 'unknown' as const,
} as const;

export const PetTemperament = {
  FRIENDLY: 'friendly' as const,
  AGGRESSIVE: 'aggressive' as const,
  SHY: 'shy' as const,
  PLAYFUL: 'playful' as const,
  CALM: 'calm' as const,
  ENERGETIC: 'energetic' as const,
  NERVOUS: 'nervous' as const,
  UNKNOWN: 'unknown' as const,
} as const;

export const VisitType = {
  CONSULTATION: 'consultation' as const,
  VACCINATION: 'vaccination' as const,
  SURGERY: 'surgery' as const,
  EMERGENCY: 'emergency' as const,
  CHECKUP: 'checkup' as const,
  OTHER: 'other' as const,
} as const;

export const AppointmentPetStatus = {
  PENDING: 'pending' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
} as const;
