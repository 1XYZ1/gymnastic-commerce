/**
 * Configuración de dependencias para el módulo cart
 */

import { gymApi } from '@/api/gymApi';
import { CartApiRepository } from './CartApiRepository';
import type { ICartRepository } from './ICartRepository';

// Instanciar repository (singleton)
export const cartRepository: ICartRepository = new CartApiRepository(gymApi);

// Exportar tipos
export type { ICartRepository } from './ICartRepository';
