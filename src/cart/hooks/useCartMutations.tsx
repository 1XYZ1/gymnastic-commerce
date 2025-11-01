/**
 * useCartMutations Hook - WRITE operations for cart
 *
 * Responsabilidades:
 * - Agregar items al carrito
 * - Actualizar cantidad/talla de items
 * - Eliminar items del carrito
 * - Vaciar el carrito
 * - Optimistic updates para UX fluida
 *
 * IMPORTANTE: Solo escritura, para lectura usar useCart
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartRepository } from '../repositories';
import { CART_SUCCESS_MESSAGES } from '../config/cart.config';
import { CartErrorService } from '../services/CartErrorService';
import type {
  Cart,
  AddCartItemDto,
  UpdateCartItemDto,
  SyncCartDto,
  CartSyncResult,
} from '../types/cart.types';
import { CartSyncService } from '../services/CartSyncService';
import { GuestCartStorageService } from '../services/GuestCartStorageService';

/**
 * Hook para mutaciones del carrito con optimistic updates
 *
 * @returns Objeto con todas las mutaciones disponibles
 *
 * @example
 * ```tsx
 * function ProductCard({ product }) {
 *   const { addItem } = useCartMutations();
 *
 *   const handleAddToCart = () => {
 *     addItem.mutate({
 *       productId: product.id,
 *       quantity: 1,
 *       size: 'M'
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleAddToCart} disabled={addItem.isPending}>
 *       {addItem.isPending ? 'Agregando...' : 'Agregar al carrito'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useCartMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Agregar un item al carrito
   * Incluye optimistic update para UX instantánea
   */
  const addItem = useMutation<Cart, Error, AddCartItemDto, { previousCart?: Cart }>({
    mutationFn: async (dto: AddCartItemDto) => {
      return await cartRepository.addItem(dto);
    },

    // Optimistic update: actualizar UI inmediatamente
    onMutate: async (_dto) => {
      // Cancelar queries pendientes para evitar sobrescribir
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Snapshot del estado anterior (para rollback)
      const previousCart = queryClient.getQueryData<Cart>(['cart']);

      // Actualizar cache optimísticamente
      if (previousCart) {
        const optimisticCart: Cart = {
          ...previousCart,
          // Aquí se agregaría el item (simplificado, el servidor lo hace)
          updatedAt: new Date(),
        };

        queryClient.setQueryData<Cart>(['cart'], optimisticCart);
      }

      // Retornar contexto para rollback
      return { previousCart };
    },

    onSuccess: () => {
      toast.success(CART_SUCCESS_MESSAGES.ITEM_ADDED);
    },

    onError: (error, _variables, context) => {
      // Rollback en caso de error
      if (context?.previousCart) {
        queryClient.setQueryData<Cart>(['cart'], context.previousCart);
      }

      const message = CartErrorService.getErrorMessage(error);
      toast.error(message);
    },

    // Siempre refetch para sincronizar con servidor
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  /**
   * Actualizar cantidad o talla de un item
   * Incluye optimistic update
   */
  const updateItem = useMutation<
    Cart,
    Error,
    { itemId: string; dto: UpdateCartItemDto },
    { previousCart?: Cart }
  >({
    mutationFn: async ({ itemId, dto }) => {
      return await cartRepository.updateItem(itemId, dto);
    },

    onMutate: async ({ itemId, dto }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      const previousCart = queryClient.getQueryData<Cart>(['cart']);

      // Actualizar cache optimísticamente
      if (previousCart) {
        const optimisticCart: Cart = {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: dto.quantity, size: dto.size || item.size }
              : item
          ),
          updatedAt: new Date(),
        };

        queryClient.setQueryData<Cart>(['cart'], optimisticCart);
      }

      return { previousCart };
    },

    onSuccess: () => {
      toast.success(CART_SUCCESS_MESSAGES.ITEM_UPDATED);
    },

    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<Cart>(['cart'], context.previousCart);
      }

      const message = CartErrorService.getErrorMessage(error);
      toast.error(message);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  /**
   * Eliminar un item del carrito
   * Sin optimistic update (operación rápida)
   */
  const removeItem = useMutation<Cart, Error, string>({
    mutationFn: async (itemId: string) => {
      return await cartRepository.removeItem(itemId);
    },

    onSuccess: () => {
      toast.success(CART_SUCCESS_MESSAGES.ITEM_REMOVED);
    },

    onError: (error) => {
      const message = CartErrorService.getErrorMessage(error);
      toast.error(message);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  /**
   * Vaciar todo el carrito
   * Sin optimistic update
   */
  const clearCart = useMutation<Cart, Error, void>({
    mutationFn: async () => {
      return await cartRepository.clearCart();
    },

    onSuccess: () => {
      toast.success(CART_SUCCESS_MESSAGES.CART_CLEARED);
    },

    onError: (error) => {
      const message = CartErrorService.getErrorMessage(error);
      toast.error(message);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  /**
   * Sincronizar carrito guest con backend
   * Usado después del login para migrar items del localStorage
   */
  const syncCart = useMutation<CartSyncResult, Error, SyncCartDto>({
    mutationFn: async (dto: SyncCartDto) => {
      return await cartRepository.syncCart(dto);
    },

    onSuccess: (result) => {
      // Handle sync result with notifications
      CartSyncService.handleSyncResult(result);

      // Clear guest cart from localStorage after successful sync
      GuestCartStorageService.clear();

      // Update cart cache with synced cart
      queryClient.setQueryData<Cart>(['cart'], result.cart);
    },

    onError: (error) => {
      CartSyncService.handleSyncError(error);
    },

    onSettled: async () => {
      // Invalidate cart query to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    addItem,
    updateItem,
    removeItem,
    clearCart,
    syncCart,
  };
};
