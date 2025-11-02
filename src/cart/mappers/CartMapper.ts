/**
 * CartMapper - Transforms Cart data from API to domain
 *
 * Responsibilities:
 * - Map product images to full URLs using ProductMapper
 * - Transform date strings to Date objects
 * - Ensure data consistency across all Cart responses
 */

import { ProductMapper } from '@/shop/mappers/ProductMapper';
import type { Cart, CartItem, CartSyncResult } from '../types/cart.types';

export class CartMapper {
  private productMapper: ProductMapper;

  constructor(baseUrl: string) {
    this.productMapper = new ProductMapper(baseUrl);
  }

  /**
   * Maps a single CartItem with product image transformation
   */
  private mapCartItem(item: CartItem): CartItem {
    console.log('[CartMapper] Original item.product.images:', item.product.images);
    const mappedProduct = this.productMapper.toDomain(item.product);
    console.log('[CartMapper] Mapped product.images:', mappedProduct.images);
    return {
      ...item,
      product: mappedProduct,
    };
  }

  /**
   * Maps Cart from API to domain model
   * Transforms all product images to full URLs and dates to Date objects
   */
  toDomain(apiCart: Cart): Cart {
    console.log('[CartMapper] toDomain called with cart:', apiCart);
    console.log('[CartMapper] Base URL used:', this.productMapper);
    return {
      ...apiCart,
      items: apiCart.items.map(item => this.mapCartItem(item)),
      updatedAt: new Date(apiCart.updatedAt),
    };
  }

  /**
   * Maps CartSyncResult from API to domain model
   * Used when syncing guest cart with authenticated cart
   */
  toSyncResult(apiResult: CartSyncResult): CartSyncResult {
    return {
      ...apiResult,
      cart: this.toDomain(apiResult.cart),
    };
  }
}
