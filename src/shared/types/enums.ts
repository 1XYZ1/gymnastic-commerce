// ========================================
// ENUMS SINCRONIZADOS CON BACKEND
// ========================================
// Estos enums deben coincidir EXACTAMENTE con los del backend
// Backend location: pet-shop-back/src/common/enums/

// PetSpecies (6 valores) - Backend: PetSpecies enum
export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';

// PetGender (3 valores) - Backend: PetGender enum
export type PetGender = 'male' | 'female' | 'unknown';

// PetTemperament (8 valores) - Backend: PetTemperament enum
export type PetTemperament = 'calm' | 'nervous' | 'aggressive' | 'friendly' | 'shy' | 'playful' | 'energetic' | 'unknown';

// VisitType (5 valores) - Backend: VisitType enum
export type VisitType = 'consultation' | 'vaccination' | 'surgery' | 'emergency' | 'checkup';

// AppointmentStatus (4 valores) - Backend: AppointmentStatus enum
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// WeightSource (3 valores) - Backend: WeightSource enum (para DTOs de respuesta)
export type WeightSource = 'medical' | 'grooming' | 'manual';

// VaccinationStatus (3 valores) - Backend: VaccinationStatus enum (para DTOs de respuesta)
export type VaccinationStatus = 'up_to_date' | 'due_soon' | 'overdue';

// ========================================
// CONSTANTES PARA ACCESO FÁCIL
// ========================================

export const PetSpecies = {
  DOG: 'dog' as const,
  CAT: 'cat' as const,
  BIRD: 'bird' as const,
  RABBIT: 'rabbit' as const,
  HAMSTER: 'hamster' as const,
  OTHER: 'other' as const,
} as const;

export const PetGender = {
  MALE: 'male' as const,
  FEMALE: 'female' as const,
  UNKNOWN: 'unknown' as const,
} as const;

export const PetTemperament = {
  CALM: 'calm' as const,
  NERVOUS: 'nervous' as const,
  AGGRESSIVE: 'aggressive' as const,
  FRIENDLY: 'friendly' as const,
  SHY: 'shy' as const,
  PLAYFUL: 'playful' as const,
  ENERGETIC: 'energetic' as const,
  UNKNOWN: 'unknown' as const,
} as const;

export const VisitType = {
  CONSULTATION: 'consultation' as const,
  VACCINATION: 'vaccination' as const,
  SURGERY: 'surgery' as const,
  EMERGENCY: 'emergency' as const,
  CHECKUP: 'checkup' as const,
} as const;

export const AppointmentStatus = {
  PENDING: 'pending' as const,
  CONFIRMED: 'confirmed' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
} as const;

export const WeightSource = {
  MEDICAL: 'medical' as const,
  GROOMING: 'grooming' as const,
  MANUAL: 'manual' as const,
} as const;

export const VaccinationStatus = {
  UP_TO_DATE: 'up_to_date' as const,
  DUE_SOON: 'due_soon' as const,
  OVERDUE: 'overdue' as const,
} as const;
