/**
 * CartService - Business logic for cart operations
 *
 * Responsabilidades:
 * - Calcular totales (subtotal, tax, total)
 * - Validaciones de negocio
 * - Transformaciones de datos
 *
 * IMPORTANTE: Este servicio contiene SOLO lógica pura, sin side effects
 */

import type { Cart, CartItem } from '../types/cart.types';
import { CART_CONFIG } from '../config/cart.config';

export class CartService {
  /**
   * Calcula el subtotal del carrito (suma de precio * cantidad de cada item)
   */
  static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => {
      return sum + item.priceAtTime * item.quantity;
    }, 0);
  }

  /**
   * Calcula el impuesto basado en el subtotal
   */
  static calculateTax(subtotal: number): number {
    return subtotal * CART_CONFIG.TAX_RATE;
  }

  /**
   * Calcula el total final (subtotal + tax - discount)
   */
  static calculateTotal(
    subtotal: number,
    tax: number,
    discount: number = 0
  ): number {
    return subtotal + tax - discount;
  }

  /**
   * Calcula todos los totales del carrito
   */
  static calculateCartTotals(
    items: CartItem[],
    discount: number = 0
  ): {
    subtotal: number;
    tax: number;
    total: number;
  } {
    const subtotal = this.calculateSubtotal(items);
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal(subtotal, tax, discount);

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }

  /**
   * Obtiene el número total de items en el carrito
   */
  static getTotalItems(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Verifica si el carrito está vacío
   */
  static isEmpty(cart: Cart | undefined | null): boolean {
    return !cart || cart.items.length === 0;
  }

  /**
   * Valida que la cantidad esté dentro de los límites permitidos
   */
  static isValidQuantity(quantity: number): boolean {
    return (
      quantity >= CART_CONFIG.MIN_QUANTITY_PER_ITEM &&
      quantity <= CART_CONFIG.MAX_QUANTITY_PER_ITEM
    );
  }

  /**
   * Verifica si un producto ya existe en el carrito
   */
  static findItemByProduct(
    items: CartItem[],
    productId: string,
    size: string
  ): CartItem | undefined {
    return items.find(
      (item) => item.productId === productId && item.size === size
    );
  }

  /**
   * Verifica si el precio del producto ha cambiado
   */
  static hasPriceChanged(
    cartItem: CartItem,
    currentPrice: number
  ): boolean {
    return cartItem.priceAtTime !== currentPrice;
  }

  /**
   * Formatea un precio con el símbolo de moneda
   */
  static formatPrice(price: number): string {
    return `${CART_CONFIG.CURRENCY_SYMBOL}${price.toFixed(2)}`;
  }

  /**
   * Valida que hay stock disponible para la cantidad solicitada
   */
  static hasEnoughStock(availableStock: number, requestedQuantity: number): boolean {
    return availableStock >= requestedQuantity;
  }

  /**
   * Obtiene el ahorro generado por un descuento
   */
  static calculateSavings(originalPrice: number, discount: number): number {
    return Number((originalPrice * (discount / 100)).toFixed(2));
  }
}
