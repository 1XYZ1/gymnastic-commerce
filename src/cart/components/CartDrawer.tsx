/**
 * CartDrawer Component
 *
 * Drawer lateral que muestra el contenido del carrito de compras.
 * Incluye lista de items, resumen de precios y botón de checkout.
 *
 * Cumple con WCAG 2.1 AA para accesibilidad.
 */

import { ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '../hooks/useCart';
import { useGuestCartWithProducts } from '../hooks/useGuestCartWithProducts';
import { useAuthStore } from '@/auth/store/auth.store';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

interface CartDrawerProps {
  /**
   * Estado de apertura del drawer
   */
  open: boolean;

  /**
   * Callback para cambiar estado de apertura
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * Drawer del carrito de compras
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
export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { authStatus } = useAuthStore();

  // Obtener carrito según tipo de usuario
  const { data: authenticatedCart, isLoading: authLoading, error: authError } = useCart();
  const { data: guestCart, isLoading: guestLoading, error: guestError } = useGuestCartWithProducts();

  // Seleccionar data según autenticación
  const cart = authStatus === 'authenticated' ? authenticatedCart : guestCart;
  const isLoading = authStatus === 'authenticated' ? authLoading : guestLoading;
  const error = authStatus === 'authenticated' ? authError : guestError;
  const isEmpty = !cart || cart.items.length === 0;

  // Handler para ir a checkout
  const handleCheckout = () => {
    // TODO: Navegar a página de checkout
    console.log('Ir a checkout con cart:', cart);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-full flex-col sm:max-w-lg p-6"
        aria-describedby="cart-description"
      >
        {/* Header */}
        <SheetHeader className="p-0 pb-4">
          <SheetTitle>Carrito de compras</SheetTitle>
          <SheetDescription id="cart-description">
            {isLoading
              ? 'Cargando tu carrito...'
              : isEmpty
                ? 'Tu carrito está vacío'
                : `${cart?.items.length || 0} ${cart?.items.length === 1 ? 'producto' : 'productos'} en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-sm text-muted-foreground">
                Cargando carrito...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            className="flex flex-1 items-center justify-center"
            role="alert"
            aria-live="polite"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-destructive">
                Error al cargar el carrito
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !isLoading && !error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6 py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" strokeWidth={1.5} />
            <div className="space-y-1.5">
              <p className="text-base font-medium text-foreground">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Explora nuestros productos y agrega tus favoritos
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => onOpenChange(false)}
            >
              Continuar comprando
            </Button>
          </div>
        )}

        {/* Cart Content */}
        {!isEmpty && !isLoading && !error && cart && (
          <>
            {/* Items List */}
            <ScrollArea className="flex-1 -mx-6">
              <div className="px-6 space-y-6">
                {cart.items.map((item) => (
                  <div key={item.id}>
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer: Summary and Checkout */}
            <div className="space-y-4 border-t pt-6 -mx-6 px-6">
              <CartSummary cart={cart} />

              <div className="space-y-3 pt-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  aria-label="Proceder al pago"
                >
                  Proceder al pago
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Continuar comprando
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
