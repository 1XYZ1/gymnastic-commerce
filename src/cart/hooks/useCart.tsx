/**
 * useCart Hook - READ operations for cart
 *
 * Responsabilidades:
 * - Obtener el carrito del usuario actual
 * - Manejar estados de carga y error
 * - Cachear datos con React Query
 *
 * IMPORTANTE: Solo lectura, para mutaciones usar useCartMutations
 */

import { useQuery } from '@tanstack/react-query';
import { cartRepository } from '../repositories';
import { CART_CONFIG } from '../config/cart.config';
import { useAuthStore } from '@/auth/store/auth.store';
import { CartErrorService } from '../services/CartErrorService';
import type { Cart } from '../types/cart.types';

/**
 * Hook para obtener el carrito del usuario autenticado
 *
 * @returns Query result con el carrito y estados de carga/error
 *
 * @example
 * ```tsx
 * function CartIcon() {
 *   const { data: cart, isLoading, error } = useCart();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <Badge count={cart?.items.length || 0} />;
 * }
 * ```
 */
export const useCart = () => {
  const { authStatus } = useAuthStore();

  return useQuery<Cart, Error>({
    // Identificador único para esta query
    queryKey: ['cart'],

    // Función que obtiene los datos
    queryFn: async () => {
      try {
        return await cartRepository.getCart();
      } catch (error) {
        // Transformar error a user-friendly message
        const message = CartErrorService.getErrorMessage(error);
        throw new Error(message);
      }
    },

    // Solo ejecutar si el usuario está autenticado
    enabled: authStatus === 'authenticated',

    // Tiempo en que los datos se consideran "frescos" (5 minutos)
    // Durante este tiempo, no se refetch automáticamente
    staleTime: CART_CONFIG.CACHE.STALE_TIME,

    // Tiempo que los datos permanecen en caché sin uso (10 minutos)
    gcTime: CART_CONFIG.CACHE.CACHE_TIME,

    // Refetch cuando la ventana recupera foco
    refetchOnWindowFocus: true,

    // Refetch cuando se reconecta la red
    refetchOnReconnect: true,

    // NO refetch automático en mount si hay datos cacheados válidos
    refetchOnMount: false,

    // Retry en caso de error de red
    retry: (failureCount, error) => {
      // No reintentar si requiere auth (401)
      if (CartErrorService.requiresAuth(error)) {
        return false;
      }

      // Reintentar hasta 2 veces solo si es error recuperable
      if (CartErrorService.isRetryable(error) && failureCount < 2) {
        return true;
      }

      return false;
    },

    // Delay entre reintentos (exponencial)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook para verificar si el carrito está vacío
 *
 * @returns true si el carrito está vacío o no existe
 *
 * @example
 * ```tsx
 * function CartDrawer() {
 *   const isEmpty = useIsCartEmpty();
 *
 *   if (isEmpty) {
 *     return <EmptyCartMessage />;
 *   }
 *
 *   return <CartItems />;
 * }
 * ```
 */
export const useIsCartEmpty = (): boolean => {
  const { data: cart } = useCart();
  return !cart || cart.items.length === 0;
};

/**
 * Hook para obtener el número total de items en el carrito
 *
 * @returns Cantidad total de items (suma de cantidades)
 *
 * @example
 * ```tsx
 * function CartBadge() {
 *   const itemCount = useCartItemCount();
 *
 *   if (itemCount === 0) return null;
 *
 *   return <Badge>{itemCount}</Badge>;
 * }
 * ```
 */
export const useCartItemCount = (): number => {
  const { data: cart } = useCart();

  if (!cart || cart.items.length === 0) {
    return 0;
  }

  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
};
