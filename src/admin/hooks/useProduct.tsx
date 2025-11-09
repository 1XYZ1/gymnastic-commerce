/**
 * Hook para gestionar un producto individual
 *
 * Responsabilidad: Coordinar la obtención y mutación de un producto
 * Refactorizado para usar el repository en lugar de actions
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Product } from '@/shared/types';
import { getProductRepository } from '../repositories';
import type { ProductFormInputs } from '../types';
import { ProductFormService } from '../services';
import { PRODUCT_QUERY_CONFIG } from '../config';

/**
 * Hook para gestionar un producto (crear, obtener, actualizar)
 *
 * @param id - ID del producto a gestionar
 * @returns Query y mutation para el producto
 */
export const useProduct = (id: string) => {
  const queryClient = useQueryClient();

  // Query para obtener el producto
  const query = useQuery({
    queryKey: ['product', { id }],
    queryFn: () => getProductRepository().getProductById(id),
    retry: false,
    staleTime: PRODUCT_QUERY_CONFIG.staleTime,
  });

  // Mutation para crear o actualizar
  const mutation = useMutation({
    mutationFn: async (productLike: Partial<Product> & { files?: File[] }) => {
      const { files, ...productData } = productLike;

      // Preparar datos del producto
      const preparedData = ProductFormService.prepareProductData(
        productData as ProductFormInputs
      );

      const isCreating = id === 'new';

      // Crear o actualizar según corresponda
      if (isCreating) {
        return await getProductRepository().createProduct(
          {
            ...preparedData,
            images: productData.images || [],
          },
          files
        );
      } else {
        return await getProductRepository().updateProduct(
          id,
          {
            ...preparedData,
            images: productData.images || [],
          },
          files
        );
      }
    },
    onSuccess: (product: Product) => {
      // Invalidar caché de listado de productos
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });

      // Invalidar caché del producto específico
      queryClient.invalidateQueries({
        queryKey: ['product', { id: product.id }],
      });

      // Actualizar queryData directamente
      queryClient.setQueryData(['product', { id: product.id }], product);
    },
  });

  return {
    ...query,
    mutation,
  };
};
