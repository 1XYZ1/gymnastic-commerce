/**
 * Hook para obtener productos desde el panel de administración
 *
 * Responsabilidad: Coordinar la obtención de productos para el admin
 * Reemplaza la dependencia del hook useProducts del módulo shop
 *
 * Este hook es específico del módulo Admin y no debe depender
 * de otros módulos (shop, auth, etc.)
 */

import { useQuery } from '@tanstack/react-query';
import { productRepository } from '../repositories';
import type { ProductAdminFilter } from '../types';

/**
 * Hook para listar productos en el panel admin
 *
 * @param filter - Filtros opcionales para la búsqueda
 * @returns Query de React Query con los productos
 */
export const useAdminProducts = (filter: ProductAdminFilter = {}) => {
  return useQuery({
    queryKey: ['admin-products', filter],
    queryFn: () => productRepository.getProducts(filter),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
