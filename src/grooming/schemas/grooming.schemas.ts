/**
 * Zod Schemas para validación runtime de respuestas del API de Grooming
 * SINCRONIZADO CON BACKEND: pet-shop-back/src/common/enums/
 */
import { z } from 'zod';

/**
 * Schema para especies de mascota (6 valores)
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
 * Schema para Pet anidado (nested)
 */
export const PetNestedSchema = z.object({
  id: z.string(),
  name: z.string(),
  breed: z.string().optional(),
  species: PetSpeciesSchema.optional(),
}).optional();

/**
 * Schema para Groomer anidado (nested)
 */
export const GroomerNestedSchema = z.object({
  id: z.string(),
  fullName: z.string(),
}).optional();

/**
 * Schema principal para GroomingRecord (respuesta del API)
 */
export const GroomingRecordApiSchema = z.object({
  id: z.string(),
  sessionDate: z.string(), // ISO 8601
  servicesPerformed: z.array(z.string()),
  hairStyle: z.string().optional(),
  productsUsed: z.array(z.string()).optional(),
  skinCondition: z.string().optional(),
  coatCondition: z.string().optional(),
  behaviorDuringSession: z.string().optional(),
  observations: z.string().optional(),
  recommendations: z.string().optional(),
  durationMinutes: z.number(),
  serviceCost: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  pet: PetNestedSchema,
  groomer: GroomerNestedSchema,
});

/**
 * Tipos inferidos automáticamente
 */
export type GroomingRecordApi = z.infer<typeof GroomingRecordApiSchema>;
export type PetNestedApi = z.infer<typeof PetNestedSchema>;
export type GroomerNestedApi = z.infer<typeof GroomerNestedSchema>;
