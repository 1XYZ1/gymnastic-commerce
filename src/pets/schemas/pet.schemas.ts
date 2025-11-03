/**
 * Zod Schemas para validación runtime de respuestas del API de Pets
 */
import { z } from 'zod';

/**
 * Schema para especies de mascotas
 */
export const PetSpeciesSchema = z.enum([
  'dog',
  'cat',
  'bird',
  'rabbit',
  'hamster',
  'fish',
  'reptile',
  'other',
]);

/**
 * Schema para género
 */
export const PetGenderSchema = z.enum(['male', 'female', 'unknown']);

/**
 * Schema para temperamento
 */
export const PetTemperamentSchema = z.enum([
  'friendly',
  'aggressive',
  'shy',
  'playful',
  'calm',
  'energetic',
  'nervous',
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
 * Schema para CompleteProfile (perfil completo con relaciones)
 * Flexible para manejar datos que vienen del backend
 */
export const CompletePetProfileSchema = z.object({
  pet: PetApiSchema,
  medicalHistory: z.object({
    recentVisits: z.array(z.any()).default([]),
    totalVisits: z.number().default(0),
  }).default({ recentVisits: [], totalVisits: 0 }),
  vaccinations: z.object({
    activeVaccines: z.array(z.any()).default([]),
    upcomingVaccines: z.array(z.any()).default([]),
    totalVaccines: z.number().default(0),
  }).default({ activeVaccines: [], upcomingVaccines: [], totalVaccines: 0 }),
  weightHistory: z.array(z.object({
    date: z.string(),
    weight: z.union([z.number(), z.string().transform(Number)]),
    source: z.enum(['medical', 'grooming', 'manual']),
  })).default([]),
  groomingHistory: z.object({
    recentSessions: z.array(z.any()).default([]),
    totalSessions: z.number().default(0),
    lastSessionDate: z.string().nullable().optional(),
  }).default({ recentSessions: [], totalSessions: 0, lastSessionDate: null }),
  appointments: z.object({
    upcoming: z.array(z.any()).default([]),
    past: z.array(z.any()).default([]),
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
