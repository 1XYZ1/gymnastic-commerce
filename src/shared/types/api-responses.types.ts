import type { Product } from './product.types';

export interface ProductsResponse {
  total: number;
  pages: number;
  products: Product[];
}
