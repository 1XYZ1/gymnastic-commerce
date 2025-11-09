import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SizeSelectDialog } from '@/cart/components/SizeSelectDialog';
import type { Size, Product } from '@/shared/types';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  sizes: Size[];
  /**
   * Objeto Product completo para el carrito
   */
  product: Product;
}

/**
 * ProductCard optimizado con React.memo
 * Evita re-renders innecesarios cuando las props no cambian
 */
export const ProductCard = memo(({
  id,
  name,
  price,
  image,
  type,
  sizes,
  product,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [showSizeDialog, setShowSizeDialog] = useState(false);

  // Memoizar handlers para evitar recrearlos en cada render
  const handleCardClick = useCallback(() => {
    navigate(`/product/${id}`);
  }, [id, navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSizeDialog(true);
  }, []);

  return (
    <>
      <Card
        className="group border-0 shadow-none product-card-hover cursor-pointer"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="article"
        aria-label={`${name}, ${type}, precio $${price}`}
      >
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
            <img
              src={image}
              alt={`${name} - ${type}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="image-overlay" aria-hidden="true" />
          </div>

          <div className="pt-6 px-4 pb-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-medium text-sm tracking-tight">{name}</h3>
              <p className="text-xs text-muted-foreground uppercase">
                {type} - <span className="font-bold">{sizes.join(', ')}</span>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg" aria-label={`Precio: ${price} pesos`}>${price}</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground border-primary/20 text-xs px-4 py-2 h-8"
                onClick={handleAddToCart}
                aria-label={`Agregar ${name} al carrito`}
              >
                Agregar al carrito
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Size Selection Dialog - Fuera del Card para evitar propagación */}
      <SizeSelectDialog
        product={product}
        open={showSizeDialog}
        onOpenChange={setShowSizeDialog}
      />
    </>
  );
});

// Nombre del componente para DevTools
ProductCard.displayName = 'ProductCard';
