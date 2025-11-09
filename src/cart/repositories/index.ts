/**
 * Configuración de dependencias para el módulo cart
 */

import { gymApi } from '@/api/gymApi';
import { CartApiRepository } from './CartApiRepository';
import type { ICartRepository } from './ICartRepository';

// Lazy initialization para evitar dependencias circulares
let _cartRepository: ICartRepository | undefined;

// Exportar función getter para lazy initialization
export const getCartRepository = (): ICartRepository => {
  if (!_cartRepository) {
    _cartRepository = new CartApiRepository(gymApi);
  }
  return _cartRepository;
};

// Exportar tipos
export type { ICartRepository } from './ICartRepository';
