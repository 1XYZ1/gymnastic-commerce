import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PRODUCTS_CONFIG } from '@/config/products.config';
import { useSearchParamsUpdate } from '@/shop/hooks/useSearchParamsUpdate';

export const FilterSidebar = () => {
  const { updateMultipleParams, searchParams } = useSearchParamsUpdate();

  const currentSizes = searchParams.get('sizes')?.split(',') || []; // xs,l,xl
  const currentPrice = searchParams.get('price') || 'any';

  const handleSizeChanged = (size: string) => {
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];

    updateMultipleParams({
      page: '1',
      sizes: newSizes.length > 0 ? newSizes.join(',') : null,
    });
  };

  const handlePriceChange = (price: string) => {
    updateMultipleParams({
      page: '1',
      price,
    });
  };

  return (
    <div className="w-64 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filtros</h3>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h4 className="font-medium">Tallas</h4>
        <div className="grid grid-cols-3 gap-2">
          {PRODUCTS_CONFIG.sizes.map((size) => (
            <Button
              key={size.id}
              variant={currentSizes.includes(size.id) ? 'default' : 'outline'}
              size="sm"
              className="h-8"
              onClick={() => handleSizeChanged(size.id)}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-medium">Precio</h4>
        <RadioGroup value={currentPrice} className="space-y-3">
          {Object.entries(PRODUCTS_CONFIG.priceRanges).map(([key, range]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem
                value={key}
                id={`price-${key}`}
                checked={currentPrice === key}
                onClick={() => handlePriceChange(key)}
              />
              <Label htmlFor={`price-${key}`} className="text-sm cursor-pointer">
                {range.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
