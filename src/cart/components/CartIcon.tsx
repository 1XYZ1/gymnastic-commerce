/**
 * CartIcon Component
 *
 * Ícono de carrito con badge que muestra la cantidad de items.
 * Cumple con WCAG 2.1 AA para accesibilidad.
 */

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartItemCount } from '../hooks/useCart';
import { useGuestCartStore } from '../store/guestCart.store';
import { useAuthStore } from '@/auth/store/auth.store';
import { cn } from '@/lib/utils';

interface CartIconProps {
  /**
   * Callback ejecutado al hacer click en el ícono
   */
  onOpen: () => void;

  /**
   * Clases CSS adicionales para el botón
   */
  className?: string;
}

/**
 * Ícono del carrito de compras con badge de cantidad
 *
 * @example
 * ```tsx
 * function Header() {
 *   const [isCartOpen, setIsCartOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <CartIcon onOpen={() => setIsCartOpen(true)} />
 *       <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
 *     </>
 *   );
 * }
 * ```
 */
export function CartIcon({ onOpen, className }: CartIconProps) {
  const { authStatus } = useAuthStore();
  const authenticatedItemCount = useCartItemCount();
  const guestItemCount = useGuestCartStore((state) => state.itemCount);

  // Show authenticated cart count if logged in, otherwise show guest cart count
  const itemCount =
    authStatus === 'authenticated' ? authenticatedItemCount : guestItemCount;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpen}
        className={cn('relative', className)}
        aria-label={
          itemCount > 0
            ? `Abrir carrito de compras, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
            : 'Abrir carrito de compras'
        }
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />

        {/* Badge con cantidad de items */}
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs"
            aria-live="polite"
            aria-atomic="true"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
