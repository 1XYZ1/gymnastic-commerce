/**
 * Implementación del repositorio de productos usando API REST
 *
 * Responsabilidad: Comunicarse con la API y transformar los datos
 * usando el mapper correspondiente
 */

import type { AxiosInstance } from 'axios';
import type { IProductRepository } from './IProductRepository';
import type { ProductFilter } from '../types/product-filter.types';
import type { ProductsResponse } from '@/shared/types';
import { ProductMapper } from '../mappers/ProductMapper';

export class ProductApiRepository implements IProductRepository {
  private readonly api: AxiosInstance;
  private readonly mapper: ProductMapper;

  constructor(api: AxiosInstance, mapper: ProductMapper) {
    this.api = api;
    this.mapper = mapper;
  }

  async getProducts(filter: ProductFilter): Promise<ProductsResponse> {
    const { data } = await this.api.get<ProductsResponse>("/products", {
      params: {
        limit: filter.limit,
        offset: filter.offset,
        category: filter.category,
        sizes: filter.sizes,
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        q: filter.query,
      },
    });

    return this.mapper.toDomainList(data);
  }
}
