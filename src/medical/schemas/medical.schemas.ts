/**
 * Zod Schemas para validación runtime de respuestas del API de Medical
 */
import { z } from 'zod';

/**
 * Schema para tipos de visita médica
 */
export const VisitTypeSchema = z.enum([
  'consultation',
  'vaccination',
  'surgery',
  'emergency',
  'checkup',
  'other',
]);

/**
 * Schema para Pet anidado (nested)
 */
export const PetNestedSchema = z.object({
  id: z.string(),
  name: z.string(),
  breed: z.string().optional(),
  species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other']).optional(),
}).optional();

/**
 * Schema para Veterinarian anidado (nested)
 */
export const VeterinarianNestedSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email().optional(),
}).optional();

/**
 * Schema principal para MedicalRecord (respuesta del API)
 */
export const MedicalRecordApiSchema = z.object({
  id: z.string(),
  visitDate: z.string(), // ISO 8601
  visitType: VisitTypeSchema,
  reason: z.string(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  weightAtVisit: z.number().optional(),
  temperature: z.number().optional(),
  serviceCost: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  pet: PetNestedSchema,
  veterinarian: VeterinarianNestedSchema,
});

/**
 * Schema principal para Vaccination (respuesta del API)
 */
export const VaccinationApiSchema = z.object({
  id: z.string(),
  vaccineName: z.string(),
  administeredDate: z.string(), // ISO 8601
  nextDueDate: z.string().optional(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  pet: PetNestedSchema,
  veterinarian: VeterinarianNestedSchema,
});

/**
 * Tipos inferidos automáticamente
 */
export type MedicalRecordApi = z.infer<typeof MedicalRecordApiSchema>;
export type VaccinationApi = z.infer<typeof VaccinationApiSchema>;
export type PetNestedApi = z.infer<typeof PetNestedSchema>;
export type VeterinarianNestedApi = z.infer<typeof VeterinarianNestedSchema>;
