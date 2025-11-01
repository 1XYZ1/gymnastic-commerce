/**
 * Interface del repositorio de carrito
 * Define el contrato para acceso a datos del carrito
 *
 * Siguiendo Dependency Inversion Principle:
 * CartService y hooks dependen de esta interfaz, no de la implementación
 */

import type {
  Cart,
  AddCartItemDto,
  UpdateCartItemDto,
  SyncCartDto,
  CartSyncResult,
} from '../types/cart.types';

export interface ICartRepository {
  /**
   * Obtiene el carrito del usuario actual
   */
  getCart(): Promise<Cart>;

  /**
   * Agrega un item al carrito
   */
  addItem(dto: AddCartItemDto): Promise<Cart>;

  /**
   * Actualiza la cantidad/talla de un item
   */
  updateItem(itemId: string, dto: UpdateCartItemDto): Promise<Cart>;

  /**
   * Elimina un item del carrito
   */
  removeItem(itemId: string): Promise<Cart>;

  /**
   * Vacía completamente el carrito
   */
  clearCart(): Promise<Cart>;

  /**
   * Sincroniza items del carrito guest con el carrito del usuario autenticado
   */
  syncCart(dto: SyncCartDto): Promise<CartSyncResult>;
}
