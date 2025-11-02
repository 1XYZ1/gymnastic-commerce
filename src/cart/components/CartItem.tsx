/**
 * CartItem Component
 *
 * Representa un item individual en el carrito con controles para:
 * - Actualizar cantidad
 * - Eliminar del carrito
 * - Mostrar información del producto
 *
 * Cumple con WCAG 2.1 AA para accesibilidad.
 */

import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartMutations } from '../hooks/useCartMutations';
import { useAuthStore } from '@/auth/store/auth.store';
import { useGuestCartStore } from '../store/guestCart.store';
import { useImageAnimation } from '@/shared/hooks';
import { CartService } from '../services/CartService';
import { CART_CONFIG } from '../config/cart.config';
import type { CartItem as CartItemType } from '../types/cart.types';
import { cn } from '@/lib/utils';

interface CartItemProps {
  /**
   * Item del carrito a mostrar
   */
  item: CartItemType;

  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente de item individual del carrito
 *
 * @example
 * ```tsx
 * function CartDrawer() {
 *   const { data: cart } = useCart();
 *
 *   return (
 *     <div>
 *       {cart?.items.map((item) => (
 *         <CartItem key={item.id} item={item} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function CartItem({ item, className }: CartItemProps) {
  const { ref, isVisible } = useImageAnimation({ threshold: 0.1, triggerOnce: true });
  const { authStatus } = useAuthStore();

  // Hooks para carrito autenticado
  const { updateItem, removeItem } = useCartMutations();

  // Hooks para carrito guest
  const updateGuestItem = useGuestCartStore((state) => state.updateItemQuantity);
  const removeGuestItem = useGuestCartStore((state) => state.removeItem);

  // Calcular subtotal del item
  const itemSubtotal = item.priceAtTime * item.quantity;

  // Handlers
  const handleIncrement = () => {
    if (
      item.quantity < CART_CONFIG.MAX_QUANTITY_PER_ITEM &&
      item.quantity < item.product.stock
    ) {
      if (authStatus === 'authenticated') {
        updateItem.mutate({
          itemId: item.id,
          dto: { quantity: item.quantity + 1 },
        });
      } else {
        // Para guest: usar productId y size
        updateGuestItem(item.productId, item.size, item.quantity + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (item.quantity > CART_CONFIG.MIN_QUANTITY_PER_ITEM) {
      if (authStatus === 'authenticated') {
        updateItem.mutate({
          itemId: item.id,
          dto: { quantity: item.quantity - 1 },
        });
      } else {
        // Para guest: usar productId y size
        updateGuestItem(item.productId, item.size, item.quantity - 1);
      }
    }
  };

  const handleRemove = () => {
    if (authStatus === 'authenticated') {
      removeItem.mutate(item.id);
    } else {
      // Para guest: usar productId y size
      removeGuestItem(item.productId, item.size);
    }
  };

  // Estados de carga (solo para usuarios autenticados)
  const isUpdating = authStatus === 'authenticated' && updateItem.isPending && updateItem.variables?.itemId === item.id;
  const isRemoving = authStatus === 'authenticated' && removeItem.isPending && removeItem.variables === item.id;
  const isLoading = isUpdating || isRemoving;

  // Verificar si el precio cambió
  const priceChanged = item.priceAtTime !== item.product.price;

  return (
    <div
      className={cn(
        'flex gap-4 py-4',
        isLoading && 'opacity-50 pointer-events-none',
        className
      )}
      role="article"
      aria-label={`${item.product.title}, talla ${item.size}, cantidad ${item.quantity}`}
    >
      {/* Imagen del producto */}
      <div ref={ref} className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        {item.product.images && item.product.images.length > 0 ? (
          <img
            src={item.product.images[0]}
            alt={item.product.title}
            className={cn('h-full w-full object-cover object-center', isVisible ? 'image-fade-in' : 'image-animate-base')}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                    Sin imagen
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          {/* Título y talla */}
          <div className="flex-1">
            <h3 className="text-sm font-medium line-clamp-2">
              {item.product.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Talla: <span className="font-medium">{item.size}</span>
            </p>

            {/* Alerta de cambio de precio */}
            {priceChanged && (
              <p className="mt-1 text-xs text-amber-600" role="alert">
                Precio actualizado
              </p>
            )}
          </div>

          {/* Botón eliminar */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRemove}
            disabled={isLoading}
            aria-label={`Eliminar ${item.product.title} del carrito`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Precio y controles */}
        <div className="mt-auto flex items-end justify-between pt-2">
          {/* Controles de cantidad */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleDecrement}
              disabled={
                isLoading || item.quantity <= CART_CONFIG.MIN_QUANTITY_PER_ITEM
              }
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <div
              className="flex h-7 w-10 items-center justify-center text-sm font-medium"
              role="status"
              aria-live="polite"
              aria-label={`Cantidad: ${item.quantity}`}
            >
              {item.quantity}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleIncrement}
              disabled={
                isLoading ||
                item.quantity >= CART_CONFIG.MAX_QUANTITY_PER_ITEM ||
                item.quantity >= item.product.stock
              }
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Precio */}
          <div className="text-right">
            <p className="text-sm font-semibold" aria-label={`Subtotal: ${CartService.formatPrice(itemSubtotal)}`}>
              {CartService.formatPrice(itemSubtotal)}
            </p>
            <p className="text-xs text-muted-foreground">
              {CartService.formatPrice(item.priceAtTime)} c/u
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
