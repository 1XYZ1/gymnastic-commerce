/**
 * Hook para extraer y parsear filtros de productos desde la URL
 *
 * Responsabilidad: Leer search params y convertirlos en un ProductFilter
 * usando el servicio de dominio para la lógica de negocio
 */

import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { ProductFilterService } from '../services/ProductFilterService';
import { PRODUCTS_CONFIG } from '@/config/products.config';
import type { ProductFilter } from '../types/product-filter.types';

export const useProductFilters = (): ProductFilter => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    // Parsear parámetros de precio
    const priceKey = searchParams.get("price") || "any";
    const { min: minPrice, max: maxPrice } = ProductFilterService.parsePriceRange(priceKey);

    // Parsear parámetros de paginación
    const page = ProductFilterService.parseNumericParam(
      searchParams.get("page"),
      PRODUCTS_CONFIG.pagination.defaultPage
    );
    const limit = ProductFilterService.parseNumericParam(
      searchParams.get("limit"),
      PRODUCTS_CONFIG.pagination.defaultLimit
    );

    // Calcular offset
    const { offset } = ProductFilterService.calculatePagination(page, limit);

    return {
      offset,
      limit,
      category,
      sizes: searchParams.get("sizes") || undefined,
      query: searchParams.get("q") || undefined,
      minPrice,
      maxPrice,
    };
  }, [searchParams, category]);
};
