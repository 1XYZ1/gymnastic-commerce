import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Size } from '@/shared/types';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: Size[];
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  sizes,
}: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implementar lógica de carrito
    console.log(`Agregar producto ${id} al carrito`);
  };

  return (
    <Card
      className="group border-0 shadow-none product-card-hover cursor-pointer"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${name}, ${category}, precio $${price}`}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
          <img
            src={image}
            alt={`${name} - ${category}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="image-overlay" aria-hidden="true" />
        </div>

        <div className="pt-6 px-4 pb-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium text-sm tracking-tight">{name}</h3>
            <p className="text-xs text-muted-foreground uppercase">
              {category} - <span className="font-bold">{sizes.join(', ')}</span>
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
  );
};
