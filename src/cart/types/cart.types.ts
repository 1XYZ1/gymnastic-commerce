import type { Product, Size } from '@/shared/types';

/**
 * Represents a single item in the shopping cart
 */
export interface CartItem {
  /** Unique identifier for the cart item */
  id: string;

  /** Reference to the product ID */
  productId: string;

  /** Product snapshot at the time of adding to cart */
  product: Product;

  /** Quantity of the product in cart */
  quantity: number;

  /** Selected size for the product */
  size: Size;

  /** Price at the time of adding to cart (for price change detection) */
  priceAtTime: number;
}

/**
 * Represents the user's shopping cart
 */
export interface Cart {
  /** Unique identifier for the cart */
  id: string;

  /** User ID who owns the cart */
  userId: string;

  /** List of items in the cart */
  items: CartItem[];

  /** Subtotal before taxes and discounts */
  subtotal: number;

  /** Tax amount */
  tax: number;

  /** Discount amount */
  discount: number;

  /** Final total amount */
  total: number;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * DTO for adding a new item to the cart
 */
export interface AddCartItemDto {
  /** Product ID to add */
  productId: string;

  /** Quantity to add */
  quantity: number;

  /** Selected size */
  size: Size;
}

/**
 * DTO for updating an existing cart item
 */
export interface UpdateCartItemDto {
  /** New quantity */
  quantity: number;

  /** Optional: update size */
  size?: Size;
}

/**
 * Response from cart API operations
 */
export interface CartResponse {
  cart: Cart;
  message?: string;
}

/**
 * Error response from cart operations
 */
export interface CartError {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * Represents an item in the guest cart (localStorage)
 */
export interface GuestCartItem {
  /** Product ID */
  productId: string;

  /** Quantity */
  quantity: number;

  /** Selected size */
  size: string;
}

/**
 * Failed item during cart synchronization
 */
export interface FailedCartItem {
  /** The item that failed to sync */
  item: GuestCartItem;

  /** Reason for failure */
  reason: string;
}

/**
 * Result of cart synchronization operation
 */
export interface CartSyncResult {
  /** Number of items successfully synced */
  synced: number;

  /** Array of items that failed to sync */
  failed: FailedCartItem[];

  /** Updated cart after synchronization */
  cart: Cart;
}

/**
 * DTO for syncing guest cart items
 */
export interface SyncCartDto {
  /** Array of guest cart items to sync */
  items: GuestCartItem[];
}
