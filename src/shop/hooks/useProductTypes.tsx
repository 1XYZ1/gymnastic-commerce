/**
 * Hook para obtener los tipos de productos disponibles dinámicamente
 *
 * Este hook obtiene todos los productos y extrae los tipos únicos
 * para mostrarlos en los filtros, ordenados alfabéticamente
 */

import { useQuery } from '@tanstack/react-query';
import { productRepository } from '../repositories';
import { PRODUCTS_CONFIG } from '@/config/products.config';

export const useProductTypes = () => {
  return useQuery({
    queryKey: ['product-types'],
    queryFn: async () => {
      // Obtener una muestra grande de productos para extraer todos los tipos
      const response = await productRepository.getProducts({
        limit: 100,
        offset: 0,
      });

      // Extraer tipos únicos y ordenarlos alfabéticamente
      const types = Array.from(
        new Set(response.products.map((product) => product.type))
      ).sort((a, b) => a.localeCompare(b));

      return types;
    },
    staleTime: PRODUCTS_CONFIG.cache.staleTime,
  });
};
