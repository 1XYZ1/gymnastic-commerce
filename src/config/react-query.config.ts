/**
 * Configuración centralizada de React Query
 *
 * Define staleTime optimizado según el contexto de uso:
 * - Shop: 5 minutos (datos cambian poco, catálogo relativamente estático)
 * - Admin: 1 minuto (cambios frecuentes, necesita estar actualizado)
 * - Auth: 0 (inmediato, siempre verificar autenticación)
 * - Services/Appointments: 3 minutos (balance entre frescura y cache)
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Tiempos de staleTime según contexto de uso
 */
export const REACT_QUERY_STALE_TIMES = {
  // Shop: datos del catálogo cambian poco
  shop: 5 * 60 * 1000, // 5 minutos

  // Admin: panel administrativo necesita datos frescos
  admin: 1 * 60 * 1000, // 1 minuto

  // Auth: autenticación debe verificarse inmediatamente
  auth: 0, // 0ms (siempre refetch)

  // Services, Appointments, Pets: balance entre frescura y cache
  standard: 3 * 60 * 1000, // 3 minutos

  // Medical/Grooming records: historial relativamente estático
  records: 5 * 60 * 1000, // 5 minutos
} as const;

/**
 * Configuración global del QueryClient
 *
 * Defaults conservadores que mantienen datos frescos
 * sin hacer refetch excesivos
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime por defecto: 3 minutos (balance general)
      staleTime: REACT_QUERY_STALE_TIMES.standard,

      // Refetch cuando usuario regresa a la ventana
      refetchOnWindowFocus: true,

      // Refetch cuando se reconecta a internet
      refetchOnReconnect: true,

      // No refetch automático en mount si datos aún frescos
      refetchOnMount: true,

      // Retry fallido solo 1 vez (evita múltiples requests fallidos)
      retry: 1,

      // Función de retry con backoff exponencial
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Garbage collection: mantener datos en cache por 5 minutos después de no usarse
      gcTime: 5 * 60 * 1000,
    },
    mutations: {
      // Retry mutations fallidas 0 veces (usuario debe reintentarlo manualmente)
      retry: 0,
    },
  },
});
