import type { GuestCartItem } from '../types/cart.types';

/**
 * Service for managing guest cart in localStorage
 * Handles all localStorage operations for unauthenticated users
 */
export class GuestCartStorageService {
  private static readonly STORAGE_KEY = 'guestCart';

  /**
   * Retrieves guest cart items from localStorage
   * @returns Array of guest cart items, or empty array if none exist
   */
  static getItems(): GuestCartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);

      // Validate structure
      if (!Array.isArray(parsed)) {
        console.warn('Invalid guest cart format in localStorage, clearing');
        this.clear();
        return [];
      }

      return parsed;
    } catch (error) {
      console.error('Error parsing guest cart from localStorage:', error);
      this.clear();
      return [];
    }
  }

  /**
   * Saves guest cart items to localStorage
   * @param items - Array of guest cart items to save
   */
  static saveItems(items: GuestCartItem[]): void {
    try {
      if (items.length === 0) {
        this.clear();
        return;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving guest cart to localStorage:', error);
      throw new Error('Failed to save cart. Storage may be full.');
    }
  }

  /**
   * Adds or updates an item in the guest cart
   * If item with same productId and size exists, quantities are merged
   * @param productId - Product ID to add
   * @param quantity - Quantity to add
   * @param size - Selected size
   * @returns Updated array of guest cart items
   */
  static addItem(productId: string, quantity: number, size: string): GuestCartItem[] {
    const currentItems = this.getItems();

    // Find existing item with same product and size
    const existingIndex = currentItems.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    let updatedItems: GuestCartItem[];

    if (existingIndex !== -1) {
      // Update quantity of existing item
      updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity,
      };
    } else {
      // Add new item
      updatedItems = [...currentItems, { productId, quantity, size }];
    }

    this.saveItems(updatedItems);
    return updatedItems;
  }

  /**
   * Removes an item from the guest cart
   * @param productId - Product ID to remove
   * @param size - Size of the item to remove
   * @returns Updated array of guest cart items
   */
  static removeItem(productId: string, size: string): GuestCartItem[] {
    const currentItems = this.getItems();
    const updatedItems = currentItems.filter(
      (item) => !(item.productId === productId && item.size === size)
    );

    this.saveItems(updatedItems);
    return updatedItems;
  }

  /**
   * Updates the quantity of an item in the guest cart
   * @param productId - Product ID to update
   * @param size - Size of the item
   * @param quantity - New quantity (must be > 0)
   * @returns Updated array of guest cart items
   */
  static updateItemQuantity(
    productId: string,
    size: string,
    quantity: number
  ): GuestCartItem[] {
    if (quantity <= 0) {
      return this.removeItem(productId, size);
    }

    const currentItems = this.getItems();
    const itemIndex = currentItems.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    if (itemIndex === -1) {
      throw new Error('Item not found in guest cart');
    }

    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity,
    };

    this.saveItems(updatedItems);
    return updatedItems;
  }

  /**
   * Clears all guest cart items from localStorage
   */
  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Gets the total count of items in the guest cart
   * @returns Total quantity of all items
   */
  static getItemCount(): number {
    const items = this.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Checks if guest cart has any items
   * @returns True if cart has items, false otherwise
   */
  static hasItems(): boolean {
    return this.getItems().length > 0;
  }
}
