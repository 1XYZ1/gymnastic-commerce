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
import { Separator } from '@/components/ui/separator';
import { useCart, useIsCartEmpty } from '../hooks/useCart';
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
  const { data: cart, isLoading, error } = useCart();
  const isEmpty = useIsCartEmpty();

  // Handler para ir a checkout
  const handleCheckout = () => {
    // TODO: Navegar a página de checkout
    console.log('Ir a checkout con cart:', cart);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-full flex-col sm:max-w-lg"
        aria-describedby="cart-description"
      >
        {/* Header */}
        <SheetHeader>
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
          <div className="flex flex-1 flex-col items-center justify-center">
            <ShoppingBag
              className="h-16 w-16 text-muted-foreground/50"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold">Tu carrito está vacío</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Agrega productos para comenzar tu compra
            </p>
            <Button
              variant="outline"
              className="mt-6"
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
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="divide-y">
                {cart.items.map((item, index) => (
                  <div key={item.id}>
                    <CartItem item={item} />
                    {index < cart.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer: Summary and Checkout */}
            <div className="space-y-4 border-t pt-4">
              <CartSummary cart={cart} />

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
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
