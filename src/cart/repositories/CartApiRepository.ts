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
import { CartMapper } from '../mappers/CartMapper';

export class CartApiRepository implements ICartRepository {
  private api: AxiosInstance;
  private mapper: CartMapper;

  constructor(api: AxiosInstance) {
    this.api = api;
    this.mapper = new CartMapper(import.meta.env.VITE_API_URL || '');
  }

  async getCart(): Promise<Cart> {
    const { data } = await this.api.get<Cart>(CART_CONFIG.ENDPOINTS.GET_CART);
    console.log('[CartApiRepository] Raw data from backend:', data);
    console.log('[CartApiRepository] First item product images:', data.items?.[0]?.product?.images);
    const mapped = this.mapper.toDomain(data);
    console.log('[CartApiRepository] After mapping:', mapped);
    console.log('[CartApiRepository] First item mapped images:', mapped.items?.[0]?.product?.images);
    return mapped;
  }

  async addItem(dto: AddCartItemDto): Promise<Cart> {
    const { data } = await this.api.post<Cart>(
      CART_CONFIG.ENDPOINTS.ADD_ITEM,
      dto
    );
    return this.mapper.toDomain(data);
  }

  async updateItem(itemId: string, dto: UpdateCartItemDto): Promise<Cart> {
    const { data } = await this.api.patch<Cart>(
      CART_CONFIG.ENDPOINTS.UPDATE_ITEM(itemId),
      dto
    );
    return this.mapper.toDomain(data);
  }

  async removeItem(itemId: string): Promise<Cart> {
    const { data } = await this.api.delete<Cart>(
      CART_CONFIG.ENDPOINTS.REMOVE_ITEM(itemId)
    );
    return this.mapper.toDomain(data);
  }

  async clearCart(): Promise<Cart> {
    const { data } = await this.api.delete<Cart>(
      CART_CONFIG.ENDPOINTS.CLEAR_CART
    );
    return this.mapper.toDomain(data);
  }

  async syncCart(dto: SyncCartDto): Promise<CartSyncResult> {
    const { data } = await this.api.post<CartSyncResult>(
      CART_CONFIG.ENDPOINTS.SYNC_CART,
      dto
    );
    return this.mapper.toSyncResult(data);
  }
}
