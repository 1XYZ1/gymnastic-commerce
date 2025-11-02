/**
 * useGuestCartWithProducts Hook
 *
 * Hook especializado para obtener el carrito guest con la información completa
 * de los productos desde el backend.
 *
 * Responsabilidades:
 * - Obtener items del guest cart store (solo productId, quantity, size)
 * - Hacer fetch de los productos completos desde la API
 * - Combinar la data para crear CartItems completos
 * - Calcular totales (subtotal, tax, total)
 *
 * IMPORTANTE: Solo se habilita para usuarios NO autenticados
 */

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/auth/store/auth.store';
import { useGuestCartStore } from '../store/guestCart.store';
import { gymApi } from '@/api/gymApi';
import { ProductMapper } from '@/shop/mappers/ProductMapper';
import { CartService } from '../services/CartService';
import type { Product } from '@/shared/types';
import type { Cart, CartItem, GuestCartItem } from '../types/cart.types';

/**
 * Obtiene un producto por su ID desde la API
 */
async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    const { data } = await gymApi.get(`/products/${productId}`);
    const mapper = new ProductMapper(import.meta.env.VITE_API_URL || '');
    return mapper.toDomain(data);
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

/**
 * Obtiene múltiples productos por sus IDs
 */
async function fetchProductsByIds(productIds: string[]): Promise<Product[]> {
  const uniqueIds = [...new Set(productIds)];

  const productPromises = uniqueIds.map(id => fetchProductById(id));
  const products = await Promise.all(productPromises);

  // Filtrar productos nulos (que no se pudieron obtener)
  return products.filter((product): product is Product => product !== null);
}

/**
 * Convierte GuestCartItems + Productos a CartItems
 */
function createCartItemsFromGuest(
  guestItems: GuestCartItem[],
  products: Product[]
): CartItem[] {
  const cartItems: CartItem[] = [];

  for (const guestItem of guestItems) {
    const product = products.find(p => p.id === guestItem.productId);

    if (!product) {
      // Producto no encontrado (fue eliminado o no existe)
      console.warn(`Product ${guestItem.productId} not found, skipping...`);
      continue;
    }

    // Verificar que la talla sea válida
    const size = product.sizes.find(s => s === guestItem.size);
    if (!size) {
      console.warn(`Size ${guestItem.size} not available for product ${product.id}`);
      continue;
    }

    // Crear CartItem
    const cartItem: CartItem = {
      id: `${guestItem.productId}-${guestItem.size}`, // ID único compuesto
      productId: product.id,
      product: product,
      quantity: guestItem.quantity,
      size: size,
      priceAtTime: product.price, // Precio actual del producto
    };

    cartItems.push(cartItem);
  }

  return cartItems;
}

/**
 * Crea un objeto Cart completo para usuarios guest
 */
function createGuestCart(cartItems: CartItem[]): Cart {
  const totals = CartService.calculateCartTotals(cartItems, 0);

  return {
    id: 'guest-cart', // ID temporal para guest
    userId: 'guest', // Usuario guest
    items: cartItems,
    subtotal: totals.subtotal,
    tax: totals.tax,
    discount: 0,
    total: totals.total,
    updatedAt: new Date(),
  };
}

/**
 * Hook para obtener el carrito guest con productos completos
 *
 * @returns Query result con el carrito completo y estados de carga/error
 *
 * @example
 * ```tsx
 * function CartDrawer() {
 *   const { authStatus } = useAuthStore();
 *   const { data: cart, isLoading, error } =
 *     authStatus === 'authenticated' ? useCart() : useGuestCartWithProducts();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage />;
 *
 *   return <CartItems items={cart?.items} />;
 * }
 * ```
 */
export const useGuestCartWithProducts = () => {
  const { authStatus } = useAuthStore();
  const guestItems = useGuestCartStore((state) => state.items);

  return useQuery<Cart, Error>({
    // Identificador único para esta query
    queryKey: ['guestCart', guestItems],

    // Función que obtiene y transforma los datos
    queryFn: async (): Promise<Cart> => {
      // Si no hay items, retornar carrito vacío
      if (guestItems.length === 0) {
        return createGuestCart([]);
      }

      try {
        // 1. Extraer IDs únicos de productos
        const productIds = guestItems.map(item => item.productId);

        // 2. Obtener productos completos desde la API
        const products = await fetchProductsByIds(productIds);

        // 3. Combinar guest items con productos
        const cartItems = createCartItemsFromGuest(guestItems, products);

        // 4. Crear objeto Cart completo
        const cart = createGuestCart(cartItems);

        return cart;
      } catch (error) {
        console.error('Error creating guest cart with products:', error);
        throw new Error('No se pudo cargar el carrito');
      }
    },

    // Solo ejecutar si el usuario NO está autenticado
    enabled: authStatus !== 'authenticated',

    // Tiempo en que los datos se consideran "frescos" (30 segundos)
    // Más corto que el carrito autenticado porque puede cambiar frecuentemente
    staleTime: 1000 * 30,

    // Tiempo que los datos permanecen en caché sin uso (5 minutos)
    gcTime: 1000 * 60 * 5,

    // Refetch cuando la ventana recupera foco
    refetchOnWindowFocus: true,

    // Refetch cuando se reconecta la red
    refetchOnReconnect: true,

    // Refetch en mount si hay datos cacheados válidos
    refetchOnMount: true,

    // Retry en caso de error de red
    retry: 2,

    // Delay entre reintentos (exponencial)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
