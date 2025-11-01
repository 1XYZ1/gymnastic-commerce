/**
 * Cart configuration constants
 */
export const CART_CONFIG = {
  /**
   * Tax rate (16% = 0.16)
   */
  TAX_RATE: 0.16,

  /**
   * Maximum number of items allowed in cart
   */
  MAX_ITEMS: 50,

  /**
   * Maximum quantity per cart item
   */
  MAX_QUANTITY_PER_ITEM: 10,

  /**
   * Minimum quantity per cart item
   */
  MIN_QUANTITY_PER_ITEM: 1,

  /**
   * Currency symbol
   */
  CURRENCY_SYMBOL: '$',

  /**
   * Currency code
   */
  CURRENCY_CODE: 'USD',

  /**
   * React Query cache configuration
   */
  CACHE: {
    /**
     * Time in ms before cart data is considered stale (5 minutes)
     */
    STALE_TIME: 1000 * 60 * 5,

    /**
     * Time in ms to keep unused cart data in cache (10 minutes)
     */
    CACHE_TIME: 1000 * 60 * 10,
  },

  /**
   * API endpoints
   */
  ENDPOINTS: {
    GET_CART: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR_CART: '/cart',
    SYNC_CART: '/cart/sync',
  },
} as const;

/**
 * Cart error messages
 */
export const CART_ERROR_MESSAGES = {
  FETCH_ERROR: 'No se pudo cargar el carrito',
  ADD_ITEM_ERROR: 'No se pudo agregar el producto al carrito',
  UPDATE_ITEM_ERROR: 'No se pudo actualizar el producto',
  REMOVE_ITEM_ERROR: 'No se pudo eliminar el producto',
  CLEAR_CART_ERROR: 'No se pudo vaciar el carrito',
  MAX_QUANTITY_EXCEEDED: 'Has alcanzado la cantidad máxima para este producto',
  OUT_OF_STOCK: 'Producto sin stock disponible',
  INVALID_SIZE: 'Debes seleccionar una talla',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet',
} as const;

/**
 * Cart success messages
 */
export const CART_SUCCESS_MESSAGES = {
  ITEM_ADDED: 'Producto agregado al carrito',
  ITEM_UPDATED: 'Producto actualizado',
  ITEM_REMOVED: 'Producto eliminado del carrito',
  CART_CLEARED: 'Carrito vaciado',
} as const;

/**
 * Guest cart messages
 */
export const GUEST_CART_MESSAGES = {
  ITEM_ADDED_GUEST: 'Producto agregado (inicia sesión para guardar tu carrito)',
  SYNC_SUCCESS: (count: number) =>
    count === 1 ? '1 producto agregado a tu carrito' : `${count} productos agregados a tu carrito`,
  SYNC_PARTIAL: (synced: number, failed: number) =>
    `${synced} producto${synced > 1 ? 's' : ''} agregado${synced > 1 ? 's' : ''}. ${failed} no ${failed > 1 ? 'están disponibles' : 'está disponible'}.`,
  SYNC_ALL_FAILED_DELETED: (count: number) =>
    count === 1
      ? 'El producto que agregaste ya no está disponible'
      : 'Los productos que agregaste ya no están disponibles',
  SYNC_ALL_FAILED_OUT_OF_STOCK: (count: number) =>
    count === 1 ? 'El producto que agregaste se agotó' : 'Los productos que agregaste se agotaron',
  SYNC_ERROR: 'No se pudieron agregar los productos a tu carrito',
  SYNC_NETWORK_ERROR:
    'No se pudo sincronizar el carrito. Verifica tu conexión e intenta de nuevo.',
  SYNC_SESSION_EXPIRED: 'Sesión expirada. Por favor inicia sesión de nuevo.',
  SYNC_DETAILS: (deletedCount: number, outOfStockCount: number) => {
    const details: string[] = [];
    if (deletedCount > 0)
      details.push(`${deletedCount} eliminado${deletedCount > 1 ? 's' : ''}`);
    if (outOfStockCount > 0)
      details.push(`${outOfStockCount} sin stock`);
    return `Detalles: ${details.join(', ')}`;
  },
} as const;
