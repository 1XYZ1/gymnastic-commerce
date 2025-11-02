/**
 * CartSummary Component
 *
 * Muestra el resumen financiero del carrito:
 * - Subtotal
 * - Impuestos
 * - Descuentos (si aplica)
 * - Total
 *
 * Cumple con WCAG 2.1 AA para accesibilidad.
 */

import { Separator } from '@/components/ui/separator';
import { CartService } from '../services/CartService';
import type { Cart } from '../types/cart.types';

interface CartSummaryProps {
  /**
   * Datos del carrito para calcular totales
   */
  cart: Cart;

  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente de resumen del carrito con subtotal, impuestos y total
 *
 * @example
 * ```tsx
 * function CartDrawer() {
 *   const { data: cart } = useCart();
 *
 *   if (!cart) return null;
 *
 *   return (
 *     <div>
 *       <CartItems items={cart.items} />
 *       <CartSummary cart={cart} />
 *       <CheckoutButton />
 *     </div>
 *   );
 * }
 * ```
 */
export function CartSummary({ cart, className }: CartSummaryProps) {
  return (
    <div className={className} aria-labelledby="cart-summary-title">
      {/* Header oculto para accesibilidad */}
      <h3 id="cart-summary-title" className="sr-only">
        Resumen del carrito
      </h3>

      <div className="space-y-2 sm:space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium" aria-label={`Subtotal: ${CartService.formatPrice(cart.subtotal)}`}>
            {CartService.formatPrice(cart.subtotal)}
          </span>
        </div>

        {/* Envío */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">Envío</span>
          <span className="text-muted-foreground">Calculado al finalizar</span>
        </div>

        {/* Impuestos */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">
            Impuestos estimados
          </span>
          <span className="font-medium" aria-label={`Impuestos: ${CartService.formatPrice(cart.tax)}`}>
            {CartService.formatPrice(cart.tax)}
          </span>
        </div>

        {/* Descuento (solo si existe) */}
        {cart.discount > 0 && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-green-600">
            <span>Descuento</span>
            <span className="font-medium" aria-label={`Descuento: ${CartService.formatPrice(cart.discount)}`}>
              -{CartService.formatPrice(cart.discount)}
            </span>
          </div>
        )}

        <Separator className="my-2 sm:my-3" />

        {/* Total */}
        <div className="flex items-center justify-between text-sm sm:text-base">
          <span className="font-semibold">Total</span>
          <span
            className="text-base sm:text-lg font-bold"
            aria-label={`Total a pagar: ${CartService.formatPrice(cart.total)}`}
          >
            {CartService.formatPrice(cart.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
