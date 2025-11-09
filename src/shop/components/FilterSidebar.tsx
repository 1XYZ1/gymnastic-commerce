import { useCallback, memo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PRODUCTS_CONFIG } from '@/config/products.config';
import { useSearchParamsUpdate } from '@/shop/hooks/useSearchParamsUpdate';
import { useProductTypes } from '@/shop/hooks/useProductTypes';

/**
 * FilterSidebar optimizado con React.memo
 * Solo se re-renderiza cuando cambian los filtros activos
 */
export const FilterSidebar = memo(() => {
  const { updateMultipleParams, searchParams } = useSearchParamsUpdate();
  const { data: types, isLoading } = useProductTypes();

  const currentType = searchParams.get('type') || '';
  const currentPrice = searchParams.get('price') || 'any';

  // Memoizar handlers para evitar recrearlos
  const handleTypeChange = useCallback((type: string) => {
    updateMultipleParams({
      page: '1',
      type: type === currentType ? null : type,
    });
  }, [updateMultipleParams, currentType]);

  const handlePriceChange = useCallback((price: string) => {
    updateMultipleParams({
      page: '1',
      price,
    });
  }, [updateMultipleParams]);

  return (
    <div className="w-64 space-y-8">
      {/* Type Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Tipo</h4>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Cargando...</div>
        ) : (
          <RadioGroup value={currentType} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value=""
                id="type-all"
                checked={currentType === ''}
                onClick={() => handleTypeChange('')}
              />
              <Label htmlFor="type-all" className="text-sm cursor-pointer font-normal">
                Todos
              </Label>
            </div>
            {types?.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={type}
                  id={`type-${type}`}
                  checked={currentType === type}
                  onClick={() => handleTypeChange(type)}
                />
                <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer font-normal">
                  {type}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Precio</h4>
        <RadioGroup value={currentPrice} className="space-y-2">
          {Object.entries(PRODUCTS_CONFIG.priceRanges).map(([key, range]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem
                value={key}
                id={`price-${key}`}
                checked={currentPrice === key}
                onClick={() => handlePriceChange(key)}
              />
              <Label htmlFor={`price-${key}`} className="text-sm cursor-pointer font-normal">
                {range.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
});

// Nombre del componente para DevTools
FilterSidebar.displayName = 'FilterSidebar';
