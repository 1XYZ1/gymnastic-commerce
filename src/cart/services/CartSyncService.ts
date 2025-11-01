/**
 * CartSyncService - Guest cart synchronization logic
 *
 * Handles synchronization of guest cart items with backend
 * and provides notification feedback to users
 */

import { toast } from 'sonner';
import type { CartSyncResult, FailedCartItem } from '../types/cart.types';
import { GUEST_CART_MESSAGES } from '../config/cart.config';

export class CartSyncService {
  /**
   * Analyzes sync result and displays appropriate notifications
   * @param result - Synchronization result from backend
   */
  static handleSyncResult(result: CartSyncResult): void {
    const { synced, failed } = result;

    // CASE 1: All items synced successfully
    if (synced > 0 && failed.length === 0) {
      toast.success(GUEST_CART_MESSAGES.SYNC_SUCCESS(synced), {
        duration: 3000,
      });
      return;
    }

    // CASE 2: All items failed
    if (synced === 0 && failed.length > 0) {
      this.handleAllFailed(failed);
      return;
    }

    // CASE 3: Partial sync (some succeeded, some failed)
    if (synced > 0 && failed.length > 0) {
      this.handlePartialSync(synced, failed);
      return;
    }
  }

  /**
   * Handles case where all items failed to sync
   * @param failed - Array of failed items
   */
  private static handleAllFailed(failed: FailedCartItem[]): void {
    // Analyze failure reasons
    const allDeleted = failed.every((f) => f.reason === 'Product not found');
    const allOutOfStock = failed.every((f) =>
      f.reason.toLowerCase().includes('insufficient stock')
    );

    if (allDeleted) {
      toast.error(GUEST_CART_MESSAGES.SYNC_ALL_FAILED_DELETED(failed.length), {
        duration: 7000,
      });
    } else if (allOutOfStock) {
      toast.warning(GUEST_CART_MESSAGES.SYNC_ALL_FAILED_OUT_OF_STOCK(failed.length), {
        duration: 7000,
      });
    } else {
      toast.error(GUEST_CART_MESSAGES.SYNC_ERROR, {
        duration: 7000,
      });
    }

    // Log details for debugging
    console.warn('All items failed to sync:', failed);
  }

  /**
   * Handles partial synchronization case
   * @param synced - Number of successfully synced items
   * @param failed - Array of failed items
   */
  private static handlePartialSync(synced: number, failed: FailedCartItem[]): void {
    toast.warning(GUEST_CART_MESSAGES.SYNC_PARTIAL(synced, failed.length), {
      duration: 5000,
    });

    // Show additional details after a delay
    setTimeout(() => {
      const deletedCount = failed.filter((f) => f.reason === 'Product not found').length;
      const outOfStockCount = failed.filter((f) =>
        f.reason.toLowerCase().includes('insufficient stock')
      ).length;

      if (deletedCount > 0 || outOfStockCount > 0) {
        toast.info(GUEST_CART_MESSAGES.SYNC_DETAILS(deletedCount, outOfStockCount), {
          duration: 4000,
        });
      }
    }, 1000);

    // Log details for debugging
    console.warn('Partial sync completed. Failed items:', failed);
  }

  /**
   * Handles sync errors (network, auth, etc.)
   * @param error - Error object
   */
  static handleSyncError(error: unknown): void {
    console.error('Cart sync error:', error);

    // Check for specific error types
    if (this.isAuthError(error)) {
      toast.error(GUEST_CART_MESSAGES.SYNC_SESSION_EXPIRED, {
        duration: 7000,
      });
      return;
    }

    if (this.isNetworkError(error)) {
      toast.error(GUEST_CART_MESSAGES.SYNC_NETWORK_ERROR, {
        duration: 7000,
      });
      return;
    }

    // Generic error
    toast.error(GUEST_CART_MESSAGES.SYNC_ERROR, {
      duration: 7000,
    });
  }

  /**
   * Shows notification for adding item to guest cart
   */
  static showGuestCartAddedNotification(): void {
    toast.success(GUEST_CART_MESSAGES.ITEM_ADDED_GUEST, {
      duration: 4000,
    });
  }

  /**
   * Checks if error is authentication-related
   * @param error - Error object
   */
  private static isAuthError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as any).response;
      return response?.status === 401;
    }
    return false;
  }

  /**
   * Checks if error is network-related
   * @param error - Error object
   */
  private static isNetworkError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as Error).message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('fetch')
      );
    }
    return false;
  }
}
