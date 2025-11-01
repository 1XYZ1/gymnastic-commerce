/**
 * Guest Cart Store (Zustand)
 *
 * Global state management for guest cart (unauthenticated users)
 * Provides reactive state shared across all components
 */

import { create } from 'zustand';
import { GuestCartStorageService } from '../services/GuestCartStorageService';
import type { GuestCartItem } from '../types/cart.types';

interface GuestCartState {
  /**
   * Guest cart items
   */
  items: GuestCartItem[];

  /**
   * Total count of items in cart (computed)
   */
  itemCount: number;

  /**
   * Initialize cart from localStorage
   */
  initialize: () => void;

  /**
   * Add item to guest cart
   */
  addItem: (productId: string, quantity: number, size: string) => boolean;

  /**
   * Remove item from guest cart
   */
  removeItem: (productId: string, size: string) => boolean;

  /**
   * Update item quantity
   */
  updateItemQuantity: (productId: string, size: string, quantity: number) => boolean;

  /**
   * Clear all items
   */
  clearCart: () => boolean;
}

/**
 * Guest Cart Store
 *
 * Global store for managing guest cart state.
 * Automatically syncs with localStorage via GuestCartStorageService.
 */
export const useGuestCartStore = create<GuestCartState>((set) => ({
  items: [],
  itemCount: 0,

  initialize: () => {
    try {
      const items = GuestCartStorageService.getItems();
      const itemCount = items.reduce((total, item) => total + item.quantity, 0);
      set({ items, itemCount });
    } catch (error) {
      console.error('Error initializing guest cart:', error);
    }
  },

  addItem: (productId: string, quantity: number, size: string) => {
    try {
      const updatedItems = GuestCartStorageService.addItem(productId, quantity, size);
      const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      set({ items: updatedItems, itemCount });
      return true;
    } catch (error) {
      console.error('Error adding item to guest cart:', error);
      return false;
    }
  },

  removeItem: (productId: string, size: string) => {
    try {
      const updatedItems = GuestCartStorageService.removeItem(productId, size);
      const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      set({ items: updatedItems, itemCount });
      return true;
    } catch (error) {
      console.error('Error removing item from guest cart:', error);
      return false;
    }
  },

  updateItemQuantity: (productId: string, size: string, quantity: number) => {
    try {
      const updatedItems = GuestCartStorageService.updateItemQuantity(
        productId,
        size,
        quantity
      );
      const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      set({ items: updatedItems, itemCount });
      return true;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return false;
    }
  },

  clearCart: () => {
    try {
      GuestCartStorageService.clear();
      set({ items: [], itemCount: 0 });
      return true;
    } catch (error) {
      console.error('Error clearing guest cart:', error);
      return false;
    }
  },
}));
