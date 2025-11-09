/**
 * Zod Schemas para validación runtime de respuestas del API de Pets
 * SINCRONIZADO CON BACKEND: pet-shop-back/src/common/enums/
 */
import { z } from 'zod';

/**
 * Schema para especies de mascotas (6 valores)
 * Backend: PetSpecies enum
 */
export const PetSpeciesSchema = z.enum([
  'dog',
  'cat',
  'bird',
  'rabbit',
  'hamster',
  'other',
]);

/**
 * Schema para género (3 valores)
 * Backend: PetGender enum
 */
export const PetGenderSchema = z.enum(['male', 'female', 'unknown']);

/**
 * Schema para temperamento (5 valores)
 * Backend: PetTemperament enum
 */
export const PetTemperamentSchema = z.enum([
  'calm',
  'nervous',
  'aggressive',
  'friendly',
  'unknown',
]);

/**
 * Schema para owner/dueño (nested)
 */
export const OwnerNestedSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
}).optional();

/**
 * Schema principal para una mascota (respuesta del API)
 */
export const PetApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: PetSpeciesSchema,
  breed: z.string().optional(),
  birthDate: z.string(), // ISO 8601
  gender: PetGenderSchema,
  color: z.string().optional(),
  // Backend puede devolver string o number para weight
  weight: z.union([z.number(), z.string().transform(Number)]).nullable().optional(),
  microchipNumber: z.string().nullable().optional(),
  profilePhoto: z.string().nullable().optional(),
  temperament: PetTemperamentSchema,
  behaviorNotes: z.array(z.string()),
  generalNotes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  owner: OwnerNestedSchema,
});

/**
 * Schema para respuesta paginada de mascotas
 */
export const PetsResponseSchema = z.object({
  data: z.array(PetApiSchema),
  count: z.number(),
  pages: z.number(),
});

/**
 * Schema para WeightSource (3 valores)
 * Backend: WeightSource enum
 */
export const WeightSourceSchema = z.enum(['medical', 'grooming', 'manual']);

/**
 * Schema para una visita médica individual
 */
const MedicalVisitSchema = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  visitDate: z.string().optional(),
  visitType: z.string().optional(),
  reason: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  serviceCost: z.number().optional(),
  weightAtVisit: z.union([z.number(), z.string()]).optional(),
  temperature: z.union([z.number(), z.string()]).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough(); // Permitir campos adicionales del backend

/**
 * Schema para una vacuna
 */
const VaccinationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  vaccineName: z.string().optional(),
  dateApplied: z.string().optional(),
  administeredDate: z.string().optional(),
  nextDueDate: z.string().nullable().optional(),
  batchNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough(); // Permitir campos adicionales del backend

/**
 * Schema para una sesión de grooming
 */
const GroomingSessionSchema = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  sessionDate: z.string().optional(),
  serviceType: z.string().optional(),
  servicesPerformed: z.union([z.array(z.string()), z.string()]).optional(),
  hairStyle: z.string().optional(),
  productsUsed: z.string().optional(),
  skinCondition: z.string().optional(),
  coatCondition: z.string().optional(),
  behaviorDuringSession: z.string().optional(),
  recommendations: z.string().optional(),
  durationMinutes: z.number().optional(),
  serviceCost: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough(); // Permitir campos adicionales del backend

/**
 * Schema para una cita
 */
const AppointmentSchema = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  service: z.unknown().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough(); // Permitir campos adicionales del backend

/**
 * Schema para CompleteProfile (perfil completo con relaciones)
 * Ahora con schemas específicos en lugar de z.any()
 */
export const CompletePetProfileSchema = z.object({
  pet: PetApiSchema,
  medicalHistory: z.object({
    recentVisits: z.array(MedicalVisitSchema).default([]),
    totalVisits: z.number().default(0),
  }).default({ recentVisits: [], totalVisits: 0 }),
  vaccinations: z.object({
    activeVaccines: z.array(VaccinationSchema).default([]),
    upcomingVaccines: z.array(VaccinationSchema).default([]),
    totalVaccines: z.number().default(0),
  }).default({ activeVaccines: [], upcomingVaccines: [], totalVaccines: 0 }),
  weightHistory: z.array(z.object({
    date: z.string(),
    weight: z.union([z.number(), z.string().transform(Number)]),
    source: WeightSourceSchema,
  })).default([]),
  groomingHistory: z.object({
    recentSessions: z.array(GroomingSessionSchema).default([]),
    totalSessions: z.number().default(0),
    lastSessionDate: z.string().nullable().optional(),
  }).default({ recentSessions: [], totalSessions: 0, lastSessionDate: null }),
  appointments: z.object({
    upcoming: z.array(AppointmentSchema).default([]),
    past: z.array(AppointmentSchema).default([]),
    totalAppointments: z.number().default(0),
  }).default({ upcoming: [], past: [], totalAppointments: 0 }),
  summary: z.object({
    age: z.number(),
    lastVisitDate: z.string().nullable().optional(),
    nextVaccinationDue: z.string().nullable().optional(),
    totalSpentMedical: z.number().default(0),
    totalSpentGrooming: z.number().default(0),
  }).optional(),
});

/**
 * Tipos inferidos automáticamente
 */
export type PetApi = z.infer<typeof PetApiSchema>;
export type PetsResponseApi = z.infer<typeof PetsResponseSchema>;
export type CompletePetProfileApi = z.infer<typeof CompletePetProfileSchema>;
export type OwnerNestedApi = z.infer<typeof OwnerNestedSchema>;
