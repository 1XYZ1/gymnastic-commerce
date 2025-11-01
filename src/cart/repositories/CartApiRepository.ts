/**
 * Implementación del repositorio de carrito usando API REST
 *
 * Responsabilidad: Comunicarse con la API del carrito
 */

import type { AxiosInstance } from 'axios';
import type { ICartRepository } from './ICartRepository';
import type {
  Cart,
  AddCartItemDto,
  UpdateCartItemDto,
  SyncCartDto,
  CartSyncResult,
} from '../types/cart.types';
import { CART_CONFIG } from '../config/cart.config';

export class CartApiRepository implements ICartRepository {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getCart(): Promise<Cart> {
    const { data } = await this.api.get<Cart>(CART_CONFIG.ENDPOINTS.GET_CART);

    // Transform date string to Date object
    return {
      ...data,
      updatedAt: new Date(data.updatedAt),
    };
  }

  async addItem(dto: AddCartItemDto): Promise<Cart> {
    const { data } = await this.api.post<Cart>(
      CART_CONFIG.ENDPOINTS.ADD_ITEM,
      dto
    );

    return {
      ...data,
      updatedAt: new Date(data.updatedAt),
    };
  }

  async updateItem(itemId: string, dto: UpdateCartItemDto): Promise<Cart> {
    const { data } = await this.api.patch<Cart>(
      CART_CONFIG.ENDPOINTS.UPDATE_ITEM(itemId),
      dto
    );

    return {
      ...data,
      updatedAt: new Date(data.updatedAt),
    };
  }

  async removeItem(itemId: string): Promise<Cart> {
    const { data } = await this.api.delete<Cart>(
      CART_CONFIG.ENDPOINTS.REMOVE_ITEM(itemId)
    );

    return {
      ...data,
      updatedAt: new Date(data.updatedAt),
    };
  }

  async clearCart(): Promise<Cart> {
    const { data } = await this.api.delete<Cart>(
      CART_CONFIG.ENDPOINTS.CLEAR_CART
    );

    return {
      ...data,
      updatedAt: new Date(data.updatedAt),
    };
  }

  async syncCart(dto: SyncCartDto): Promise<CartSyncResult> {
    const { data } = await this.api.post<CartSyncResult>(
      CART_CONFIG.ENDPOINTS.SYNC_CART,
      dto
    );

    // Transform date string to Date object in cart
    return {
      ...data,
      cart: {
        ...data.cart,
        updatedAt: new Date(data.cart.updatedAt),
      },
    };
  }
}
