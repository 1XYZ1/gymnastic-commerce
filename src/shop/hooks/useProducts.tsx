/**
 * Hook para obtener productos con filtros aplicados
 *
 * Responsabilidad: Coordinar la obtención de filtros y
 * la consulta de productos usando React Query
 */

import { useQuery } from "@tanstack/react-query";
import { productRepository } from '../repositories';
import { useProductFilters } from './useProductFilters';
import { PRODUCTS_CONFIG } from '@/config/products.config';

export const useProducts = () => {
  const filters = useProductFilters();

  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productRepository.getProducts(filters),
    staleTime: PRODUCTS_CONFIG.cache.staleTime,
  });
};
