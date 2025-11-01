/**
 * Barrel export y configuración de Dependency Injection
 * para repositorios del módulo Admin
 */

import { ProductApiRepository } from './ProductApiRepository';

// Singleton: Instancia única del repositorio
export const productRepository = new ProductApiRepository();

// Exportar tipos para dependencias
export type { IProductRepository } from './IProductRepository';
