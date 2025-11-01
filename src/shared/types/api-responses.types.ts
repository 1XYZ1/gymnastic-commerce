import type { Product } from './product.types';

export interface ProductsResponse {
  count: number;
  pages: number;
  products: Product[];
}
