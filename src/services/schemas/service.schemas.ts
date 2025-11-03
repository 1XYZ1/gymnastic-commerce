/**
 * Zod Schemas para validación runtime de respuestas del API de Services
 */
import { z } from 'zod';

/**
 * Schema para ServiceType
 * Backend puede devolver 'veterinary' que es equivalente a 'medical'
 */
export const ServiceTypeSchema = z.enum(['grooming', 'medical', 'veterinary']);

/**
 * Schema para User anidado (nested)
 * Backend puede devolver campos adicionales como isActive y roles
 */
export const UserNestedSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  isActive: z.boolean().optional(),
  roles: z.array(z.string()).optional(),
});

/**
 * Schema principal para Service (respuesta del API)
 */
export const ServiceApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  durationMinutes: z.number(),
  type: ServiceTypeSchema,
  image: z.string().optional(),
  isActive: z.boolean(),
  user: UserNestedSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Schema para respuesta paginada de servicios
 * El backend puede devolver { services: [...] } o { data: [...] }
 */
export const ServicesResponseApiSchema = z.object({
  // El backend puede devolver "services" o "data"
  services: z.array(ServiceApiSchema).optional(),
  data: z.array(ServiceApiSchema).optional(),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  pages: z.number().optional(),
});

/**
 * Tipos inferidos automáticamente
 */
export type ServiceApi = z.infer<typeof ServiceApiSchema>;
export type ServicesResponseApi = z.infer<typeof ServicesResponseApiSchema>;
export type UserNestedApi = z.infer<typeof UserNestedSchema>;
