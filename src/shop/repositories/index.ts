/**
 * Configuración de dependencias para el módulo shop
 *
 * Aquí se instancian los repositorios y se inyectan sus dependencias
 * Siguiendo el patrón Singleton para compartir instancias
 */

import { gymApi } from '@/api/gymApi';
import { ProductMapper } from '../mappers/ProductMapper';
import { ProductApiRepository } from './ProductApiRepository';
import type { IProductRepository } from './IProductRepository';

// Crear mapper con URL base de la API
const productMapper = new ProductMapper(import.meta.env.VITE_API_URL || '');

// Exportar instancia del repositorio (singleton)
export const productRepository: IProductRepository = new ProductApiRepository(
  gymApi,
  productMapper
);
