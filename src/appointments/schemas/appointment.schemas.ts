/**
 * Zod Schemas para validación runtime de respuestas del API de Appointments
 * SINCRONIZADO CON BACKEND: pet-shop-back/src/common/enums/
 *
 * Estos schemas validan datos del backend y generan tipos TypeScript automáticamente
 * usando z.infer<>
 */
import { z } from 'zod';

/**
 * Schema para el status de cita (4 valores)
 * Backend: AppointmentStatus enum
 */
export const AppointmentStatusSchema = z.enum([
  'pending',
  'confirmed',
  'completed',
  'cancelled',
]);

/**
 * Schema para servicio (nested en appointment)
 */
export const ServiceNestedSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['grooming', 'veterinary']),
  description: z.string(),
  price: z.number(),
  durationMinutes: z.number(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Schema para usuario/cliente (nested en appointment)
 */
export const UserNestedSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  isActive: z.boolean().optional(),
  roles: z.array(z.string()).optional(),
});

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
 * Schema para género de mascota (3 valores)
 * Backend: PetGender enum
 */
export const PetGenderSchema = z.enum(['male', 'female', 'unknown']);

/**
 * Schema para temperamento de mascota (5 valores)
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
 * Schema para pet (nested en appointment)
 * Backend puede devolver el objeto Pet completo con todos sus campos
 */
export const PetNestedSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: PetSpeciesSchema,
  breed: z.string().optional().nullable(),
  birthDate: z.string().nullable().optional(),
  gender: PetGenderSchema.optional(),
  color: z.string().optional().nullable(),
  weight: z.union([z.number(), z.string().transform(Number)]).nullable().optional(),
  microchipNumber: z.string().nullable().optional(),
  profilePhoto: z.string().nullable().optional(),
  temperament: PetTemperamentSchema.optional(),
  behaviorNotes: z.array(z.string()).optional(),
  generalNotes: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).optional();

/**
 * Schema principal para una cita (respuesta del API)
 */
export const AppointmentApiSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO 8601
  status: AppointmentStatusSchema,
  notes: z.string().optional().nullable(),
  petId: z.string().optional(), // Backend puede no enviarlo si envía el objeto pet completo
  pet: PetNestedSchema,
  service: ServiceNestedSchema,
  customer: UserNestedSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Schema para respuesta paginada de citas
 * Backend puede devolver "appointments" o "data"
 */
export const AppointmentsResponseSchema = z.object({
  appointments: z.array(AppointmentApiSchema).optional(),
  data: z.array(AppointmentApiSchema).optional(),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  pages: z.number().optional(),
});

/**
 * Tipos inferidos automáticamente desde los schemas
 */
export type AppointmentApi = z.infer<typeof AppointmentApiSchema>;
export type AppointmentsResponseApi = z.infer<typeof AppointmentsResponseSchema>;
export type ServiceNestedApi = z.infer<typeof ServiceNestedSchema>;
export type UserNestedApi = z.infer<typeof UserNestedSchema>;
export type PetNestedApi = z.infer<typeof PetNestedSchema>;
