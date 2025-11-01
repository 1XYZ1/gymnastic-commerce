/**
 * useGuestCart Hook
 *
 * Custom hook for managing guest cart (unauthenticated users)
 * Handles localStorage operations and provides reactive state
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GuestCartStorageService } from '../services/GuestCartStorageService';
import type { GuestCartItem } from '../types/cart.types';

export const useGuestCart = () => {
  // Carga síncrona inicial desde localStorage para evitar flicker
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>(() =>
    GuestCartStorageService.getItems()
  );

  // Sincronizar con storage events para cambios de otras pestañas
  useEffect(() => {
    const handleStorageChange = () => {
      const items = GuestCartStorageService.getItems();
      setGuestCart(items);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Adds an item to the guest cart
   * If item with same productId and size exists, quantities are merged
   */
  const addItem = useCallback((productId: string, quantity: number, size: string) => {
    try {
      const updatedItems = GuestCartStorageService.addItem(productId, quantity, size);
      setGuestCart(updatedItems);
      return true;
    } catch (error) {
      console.error('Error adding item to guest cart:', error);
      return false;
    }
  }, []);

  /**
   * Removes an item from the guest cart
   */
  const removeItem = useCallback((productId: string, size: string) => {
    try {
      const updatedItems = GuestCartStorageService.removeItem(productId, size);
      setGuestCart(updatedItems);
      return true;
    } catch (error) {
      console.error('Error removing item from guest cart:', error);
      return false;
    }
  }, []);

  /**
   * Updates the quantity of an item
   */
  const updateItemQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      try {
        const updatedItems = GuestCartStorageService.updateItemQuantity(
          productId,
          size,
          quantity
        );
        setGuestCart(updatedItems);
        return true;
      } catch (error) {
        console.error('Error updating item quantity in guest cart:', error);
        return false;
      }
    },
    []
  );

  /**
   * Clears all items from the guest cart
   */
  const clearCart = useCallback(() => {
    try {
      GuestCartStorageService.clear();
      setGuestCart([]);
      return true;
    } catch (error) {
      console.error('Error clearing guest cart:', error);
      return false;
    }
  }, []);

  /**
   * Gets the total count of items in the cart (reactive value)
   */
  const itemCount = useMemo(() => {
    return guestCart.reduce((total, item) => total + item.quantity, 0);
  }, [guestCart]);

  /**
   * Checks if guest cart has any items
   */
  const hasItems = useCallback(() => {
    return guestCart.length > 0;
  }, [guestCart]);

  /**
   * Gets all guest cart items
   */
  const getItems = useCallback(() => {
    return guestCart;
  }, [guestCart]);

  return {
    guestCart,
    itemCount,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    hasItems,
    getItems,
  };
};
