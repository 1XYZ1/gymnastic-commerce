/**
 * SizeSelectDialog Component
 *
 * Diálogo modal para seleccionar talla y cantidad antes de agregar al carrito.
 * Cumple con WCAG 2.1 AA para accesibilidad.
 */

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCartMutations } from '../hooks/useCartMutations';
import { useGuestCartStore } from '../store/guestCart.store';
import { CART_CONFIG } from '../config/cart.config';
import { useAuthStore } from '@/auth/store/auth.store';
import { CartSyncService } from '../services/CartSyncService';
import type { Product, Size } from '@/shared/types';

interface SizeSelectDialogProps {
  /**
   * Producto para agregar al carrito
   */
  product: Product;

  /**
   * Estado de apertura del diálogo
   */
  open: boolean;

  /**
   * Callback para cambiar estado de apertura
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * Diálogo para seleccionar talla y cantidad antes de agregar al carrito
 *
 * @example
 * ```tsx
 * function ProductCard({ product }) {
 *   const [showDialog, setShowDialog] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setShowDialog(true)}>
 *         Agregar al carrito
 *       </Button>
 *       <SizeSelectDialog
 *         product={product}
 *         open={showDialog}
 *         onOpenChange={setShowDialog}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function SizeSelectDialog({
  product,
  open,
  onOpenChange,
}: SizeSelectDialogProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToGuest, setIsAddingToGuest] = useState(false);
  const { addItem } = useCartMutations();
  const addToGuestCart = useGuestCartStore((state) => state.addItem);
  const { authStatus } = useAuthStore();

  const isAuthenticated = authStatus === 'authenticated';

  // Reset al cerrar
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedSize(null);
      setQuantity(1);
      setIsAddingToGuest(false);
    }
    onOpenChange(newOpen);
  };

  // Incrementar cantidad
  const handleIncrement = () => {
    if (quantity < CART_CONFIG.MAX_QUANTITY_PER_ITEM && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  // Decrementar cantidad
  const handleDecrement = () => {
    if (quantity > CART_CONFIG.MIN_QUANTITY_PER_ITEM) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Agregar al carrito (autenticado o guest)
  const handleAddToCart = () => {
    if (!selectedSize) return;

    if (isAuthenticated) {
      // Usuario autenticado: agregar al backend
      addItem.mutate(
        {
          productId: product.id,
          quantity,
          size: selectedSize,
        },
        {
          onSuccess: () => {
            handleOpenChange(false);
          },
        }
      );
    } else {
      // Usuario no autenticado: agregar a localStorage con hook reactivo
      setIsAddingToGuest(true);
      try {
        const success = addToGuestCart(product.id, quantity, selectedSize);
        if (success) {
          CartSyncService.showGuestCartAddedNotification();
          handleOpenChange(false);
        }
      } catch (error) {
        console.error('Error adding to guest cart:', error);
      } finally {
        setIsAddingToGuest(false);
      }
    }
  };

  const canAddToCart = selectedSize && quantity > 0 && quantity <= product.stock;
  const isLoading = isAuthenticated ? addItem.isPending : isAddingToGuest;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar talla y cantidad</DialogTitle>
          <DialogDescription>
            {product.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selector de talla */}
          <div className="space-y-3">
            <Label htmlFor="size-selection" className="text-sm font-semibold">
              Talla *
            </Label>
            <RadioGroup
              id="size-selection"
              value={selectedSize || ''}
              onValueChange={(value) => setSelectedSize(value as Size)}
              className="grid grid-cols-3 gap-2"
            >
              {product.sizes.map((size) => (
                <div key={size} className="relative">
                  <RadioGroupItem
                    value={size}
                    id={`size-${size}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {!selectedSize && (
              <p className="text-xs text-muted-foreground">
                Selecciona una talla para continuar
              </p>
            )}
          </div>

          {/* Selector de cantidad */}
          <div className="space-y-3">
            <Label htmlFor="quantity" className="text-sm font-semibold">
              Cantidad
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= CART_CONFIG.MIN_QUANTITY_PER_ITEM}
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div
                className="flex h-10 w-16 items-center justify-center rounded-md border border-input bg-background text-sm font-medium"
                role="status"
                aria-live="polite"
                aria-label={`Cantidad: ${quantity}`}
              >
                {quantity}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={
                  quantity >= CART_CONFIG.MAX_QUANTITY_PER_ITEM ||
                  quantity >= product.stock
                }
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <span className="text-xs text-muted-foreground">
                Stock: {product.stock}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="mb-2 sm:mb-0"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Agregando...' : 'Agregar al carrito'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
