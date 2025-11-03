/**
 * Helper functions para validación de Zod
 * Proporciona validación segura con logging de errores
 */
import { z } from 'zod';

/**
 * Valida datos con un schema de Zod de forma segura
 * Si la validación falla, loguea el error y retorna los datos sin validar
 * Esto evita que la aplicación se rompa por problemas de validación
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string
): T {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  // Loguear error de validación pero no romper la app
  console.warn(`⚠️ [Zod Validation] Error in ${context}:`);
  console.warn('Validation errors:', result.error.format());
  console.warn('Raw data:', data);

  // Retornar datos sin validar (fallback)
  return data as T;
}

/**
 * Valida datos con un schema de Zod de forma estricta
 * Si la validación falla, lanza un error con información detallada
 */
export function strictValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error(`❌ [Zod Validation] Strict validation failed in ${context}:`);
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.format());
      console.error('Raw data:', data);
    }
    throw error;
  }
}
