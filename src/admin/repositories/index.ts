/**
 * Barrel export y configuración de Dependency Injection
 * para repositorios del módulo Admin
 */

import { ProductApiRepository } from './ProductApiRepository';

// Lazy initialization para evitar dependencias circulares
let _productRepository: ProductApiRepository | undefined;

export const getProductRepository = (): ProductApiRepository => {
  if (!_productRepository) {
    _productRepository = new ProductApiRepository();
  }
  return _productRepository;
};

// Exportar tipos para dependencias
export type { IProductRepository } from './IProductRepository';
