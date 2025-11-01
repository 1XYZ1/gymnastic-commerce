# Guía de Integración: Sincronización de Carrito Guest

> **Versión:** 1.0
> **Fecha:** Enero 2025
> **Backend API:** Pet Shop v1.0

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Flujo de Usuario](#flujo-de-usuario)
3. [Estructura de Datos](#estructura-de-datos)
4. [API Endpoint](#api-endpoint)
5. [Implementación Frontend](#implementación-frontend)
6. [Manejo de Errores](#manejo-de-errores)
7. [Casos de Prueba](#casos-de-prueba)
8. [FAQ](#faq)

---

## Introducción

Este documento describe cómo integrar la funcionalidad de sincronización de carrito de compras entre usuarios no autenticados (guest) y usuarios autenticados.

### Problema que Resuelve

- Los usuarios pueden agregar productos al carrito **sin estar autenticados**
- Al iniciar sesión, los productos agregados deben **sincronizarse automáticamente**
- Si el usuario ya tenía items en su carrito autenticado, deben **combinarse inteligentemente**
- Algunos productos pueden fallar (sin stock, eliminados) pero el proceso debe **continuar**

---

## Flujo de Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Usuario navega sin autenticar                              │
│     - Agrega Producto A (talla M, cantidad 2)                   │
│     - Agrega Producto B (talla L, cantidad 1)                   │
│     - Frontend guarda en localStorage                           │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Usuario inicia sesión                                       │
│     - Backend retorna JWT token                                 │
│     - Frontend detecta carrito guest en localStorage            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Frontend llama a POST /api/cart/sync                        │
│     - Envía array de items guardados                            │
│     - Backend procesa cada item                                 │
│     - Valida stock, tallas, existencia                          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Backend retorna resultado                                   │
│     - synced: 2 (ambos productos agregados exitosamente)        │
│     - failed: [] (ninguno falló)                                │
│     - cart: { ...carrito completo actualizado }                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Frontend actualiza UI                                       │
│     - Limpia localStorage.removeItem('guestCart')               │
│     - Actualiza estado del carrito con cart retornado           │
│     - Muestra notificaciones si hubo fallos                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Estructura de Datos

### Item del Carrito Guest (localStorage)

```typescript
interface GuestCartItem {
  productId: string;  // UUID del producto
  quantity: number;   // Cantidad (mínimo 1)
  size: string;       // Talla: "XS", "S", "M", "L", "XL", "XXL", etc.
}
```

**Ejemplo en localStorage:**
```json
// localStorage.getItem('guestCart')
[
  {
    "productId": "cd533345-f1f3-48c9-a62e-7dc2da50c8f8",
    "quantity": 2,
    "size": "M"
  },
  {
    "productId": "a1b2c3d4-e5f6-4a3b-9c8d-7e6f5a4b3c2d",
    "quantity": 1,
    "size": "XL"
  }
]
```

### Respuesta del Endpoint de Sincronización

```typescript
interface SyncResult {
  synced: number;                    // Número de items sincronizados exitosamente
  failed: FailedItem[];              // Array de items que fallaron
  cart: Cart;                        // Carrito completo actualizado
}

interface FailedItem {
  item: GuestCartItem;               // El item que falló
  reason: string;                    // Razón del fallo (mensaje descriptivo)
}

interface Cart {
  id: string;                        // UUID del carrito
  userId: string;                    // UUID del usuario
  items: CartItem[];                 // Items en el carrito
  subtotal: number;                  // Subtotal
  tax: number;                       // Impuestos (16%)
  total: number;                     // Total (subtotal + tax)
  createdAt: string;                 // ISO 8601 date
  updatedAt: string;                 // ISO 8601 date
}

interface CartItem {
  id: string;                        // UUID del cart item
  productId: string;                 // UUID del producto
  quantity: number;                  // Cantidad
  size: string;                      // Talla
  priceAtTime: number;               // Precio cuando se agregó
  product: Product;                  // Datos del producto (eager loaded)
}
```

---

## API Endpoint

### POST `/api/cart/sync`

Sincroniza los items del carrito guest con el carrito del usuario autenticado.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

#### Request Body
```json
{
  "items": [
    {
      "productId": "cd533345-f1f3-48c9-a62e-7dc2da50c8f8",
      "quantity": 2,
      "size": "M"
    },
    {
      "productId": "a1b2c3d4-e5f6-4a3b-9c8d-7e6f5a4b3c2d",
      "quantity": 1,
      "size": "XL"
    }
  ]
}
```

#### Validaciones

| Validación | Descripción |
|------------|-------------|
| **Array no vacío** | Mínimo 1 item requerido |
| **Máximo 50 items** | Límite de seguridad para prevenir DoS |
| **productId** | Debe ser UUID v4 válido |
| **quantity** | Entero >= 1 |
| **size** | String no vacío |

#### Response 200 OK - Sincronización Exitosa

```json
{
  "synced": 3,
  "failed": [],
  "cart": {
    "id": "cart-uuid",
    "userId": "user-uuid",
    "items": [
      {
        "id": "item-uuid-1",
        "productId": "product-uuid-1",
        "quantity": 2,
        "size": "M",
        "priceAtTime": 29.99,
        "product": {
          "id": "product-uuid-1",
          "title": "Collar para Perro Premium",
          "price": 29.99,
          "stock": 50,
          "sizes": ["S", "M", "L"],
          "images": [...]
        }
      },
      // ... más items
    ],
    "subtotal": 89.97,
    "tax": 14.40,
    "total": 104.37,
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:30:00.000Z"
  }
}
```

#### Response 200 OK - Sincronización Parcial (con fallos)

```json
{
  "synced": 2,
  "failed": [
    {
      "item": {
        "productId": "invalid-product-uuid",
        "quantity": 1,
        "size": "XXL"
      },
      "reason": "Product not found"
    },
    {
      "item": {
        "productId": "product-out-of-stock-uuid",
        "quantity": 5,
        "size": "L"
      },
      "reason": "Insufficient stock. Available: 2, Requested: 5"
    }
  ],
  "cart": {
    "id": "cart-uuid",
    "userId": "user-uuid",
    "items": [
      // Solo los items sincronizados exitosamente
    ],
    "subtotal": 59.98,
    "tax": 9.60,
    "total": 69.58,
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:30:00.000Z"
  }
}
```

#### Response 400 Bad Request - Límite Excedido

```json
{
  "statusCode": 400,
  "message": "Cannot sync more than 50 items at once. Please reduce the number of items.",
  "error": "Bad Request"
}
```

#### Response 400 Bad Request - Validación Fallida

```json
{
  "statusCode": 400,
  "message": [
    "Items must be an array",
    "At least one item must be provided for synchronization",
    "items.0.productId must be a UUID"
  ],
  "error": "Bad Request"
}
```

#### Response 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## Implementación Frontend

### 1. Gestión del Carrito Guest

#### Agregar producto al carrito (sin autenticar)

```typescript
// hooks/useGuestCart.ts
import { useState, useEffect } from 'react';

const GUEST_CART_KEY = 'guestCart';

interface GuestCartItem {
  productId: string;
  quantity: number;
  size: string;
}

export const useGuestCart = () => {
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);

  // Cargar del localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (stored) {
      try {
        setGuestCart(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing guest cart:', error);
        localStorage.removeItem(GUEST_CART_KEY);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    if (guestCart.length > 0) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, [guestCart]);

  const addToGuestCart = (productId: string, quantity: number, size: string) => {
    setGuestCart(prev => {
      // Buscar si ya existe el mismo producto + talla
      const existingIndex = prev.findIndex(
        item => item.productId === productId && item.size === size
      );

      if (existingIndex !== -1) {
        // Actualizar cantidad
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        // Agregar nuevo
        return [...prev, { productId, quantity, size }];
      }
    });
  };

  const removeFromGuestCart = (productId: string, size: string) => {
    setGuestCart(prev =>
      prev.filter(item => !(item.productId === productId && item.size === size))
    );
  };

  const clearGuestCart = () => {
    setGuestCart([]);
    localStorage.removeItem(GUEST_CART_KEY);
  };

  const getGuestCartItemCount = () => {
    return guestCart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    guestCart,
    addToGuestCart,
    removeFromGuestCart,
    clearGuestCart,
    getGuestCartItemCount,
  };
};
```

### 2. Sincronización después del Login

```typescript
// services/cartService.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface SyncCartRequest {
  items: Array<{
    productId: string;
    quantity: number;
    size: string;
  }>;
}

interface SyncCartResponse {
  synced: number;
  failed: Array<{
    item: {
      productId: string;
      quantity: number;
      size: string;
    };
    reason: string;
  }>;
  cart: {
    id: string;
    userId: string;
    items: any[];
    subtotal: number;
    tax: number;
    total: number;
    createdAt: string;
    updatedAt: string;
  };
}

export const syncGuestCart = async (
  guestCartItems: SyncCartRequest['items'],
  authToken: string
): Promise<SyncCartResponse> => {
  try {
    const response = await axios.post<SyncCartResponse>(
      `${API_BASE_URL}/cart/sync`,
      { items: guestCartItems },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejar errores de respuesta del servidor
      throw new Error(error.response?.data?.message || 'Error syncing cart');
    }
    throw error;
  }
};
```

### 3. Hook Completo para Manejo de Autenticación + Sincronización

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { syncGuestCart } from '@/services/cartService';
import { useGuestCart } from './useGuestCart';
import { useCartStore } from '@/store/cartStore'; // Tu store de Zustand/Redux

export const useAuth = () => {
  const router = useRouter();
  const { guestCart, clearGuestCart } = useGuestCart();
  const { setCart, showNotification } = useCartStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      // 1. Llamar a tu endpoint de login
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }

      const { token, user } = await loginResponse.json();

      // 2. Guardar token
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 3. Si hay items en el carrito guest, sincronizar
      if (guestCart.length > 0) {
        console.log(`Syncing ${guestCart.length} guest cart items...`);

        try {
          const syncResult = await syncGuestCart(guestCart, token);

          // Actualizar el carrito en el estado global
          setCart(syncResult.cart);

          // Mostrar resultado de sincronización
          if (syncResult.synced > 0) {
            showNotification({
              type: 'success',
              message: `${syncResult.synced} producto(s) agregado(s) a tu carrito`,
            });
          }

          // Mostrar advertencias para items fallidos
          if (syncResult.failed.length > 0) {
            syncResult.failed.forEach(({ item, reason }) => {
              showNotification({
                type: 'warning',
                message: `No se pudo agregar un producto: ${reason}`,
                duration: 5000,
              });
            });
          }

          // Limpiar carrito guest
          clearGuestCart();
        } catch (syncError) {
          console.error('Error syncing cart:', syncError);
          // No fallar el login por error de sincronización
          showNotification({
            type: 'error',
            message: 'No se pudieron sincronizar algunos productos. Inténtalo de nuevo.',
          });
        }
      } else {
        // Si no hay carrito guest, obtener el carrito del usuario
        const cartResponse = await fetch('http://localhost:3000/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const cart = await cartResponse.json();
        setCart(cart);
      }

      // 4. Redirigir al usuario
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return { handleLogin };
};
```

### 4. Componente de Ejemplo: ProductCard

```typescript
// components/ProductCard.tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGuestCart } from '@/hooks/useGuestCart';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    sizes: string[];
    stock: number;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, token } = useAuth();
  const { addToGuestCart } = useGuestCart();
  const { addToCart } = useCartStore();

  const handleAddToCart = async () => {
    if (isAuthenticated) {
      // Usuario autenticado: agregar directamente al backend
      try {
        const response = await fetch('http://localhost:3000/api/cart/items', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            size: selectedSize,
          }),
        });

        const updatedCart = await response.json();
        addToCart(updatedCart);

        // Mostrar notificación
        alert('Producto agregado al carrito');
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Usuario no autenticado: agregar a localStorage
      addToGuestCart(product.id, quantity, selectedSize);
      alert('Producto agregado al carrito (inicia sesión para guardar)');
    }
  };

  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p>${product.price}</p>

      <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
        {product.sizes.map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />

      <button onClick={handleAddToCart}>
        Agregar al Carrito
      </button>
    </div>
  );
};
```

---

## Manejo de Errores

### Errores Comunes y Soluciones

| Error | Causa | Solución Frontend |
|-------|-------|-------------------|
| **Product not found** | Producto eliminado | Mostrar notificación, remover del localStorage |
| **Insufficient stock** | Stock insuficiente | Mostrar alerta con stock disponible |
| **Size not available** | Talla inválida | Mostrar tallas disponibles, permitir cambio |
| **Cannot sync more than 50 items** | Demasiados items | Dividir sincronización en múltiples requests |
| **Unauthorized (401)** | Token inválido/expirado | Logout automático, re-login |

### Ejemplo: Manejo Robusto de Errores

```typescript
const syncCartWithErrorHandling = async (guestCartItems, authToken) => {
  try {
    const result = await syncGuestCart(guestCartItems, authToken);

    // Sincronización exitosa total
    if (result.failed.length === 0) {
      showNotification({
        type: 'success',
        message: `¡${result.synced} productos agregados a tu carrito!`,
      });
      clearGuestCart();
      return result.cart;
    }

    // Sincronización parcial
    if (result.synced > 0 && result.failed.length > 0) {
      showNotification({
        type: 'info',
        message: `${result.synced} productos agregados. Algunos items no pudieron sincronizarse.`,
      });

      // Mostrar detalles de fallos
      result.failed.forEach(({ item, reason }) => {
        console.warn(`Failed to sync item ${item.productId}:`, reason);
      });

      clearGuestCart();
      return result.cart;
    }

    // Todos fallaron
    if (result.synced === 0) {
      showNotification({
        type: 'error',
        message: 'No se pudieron sincronizar los productos. Revisa tu carrito.',
      });
      // Mantener items en localStorage para reintentar
      return null;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      // Token inválido
      handleLogout();
      router.push('/login');
    } else if (error.response?.status === 400) {
      showNotification({
        type: 'error',
        message: error.response.data.message || 'Error en la sincronización',
      });
    } else {
      showNotification({
        type: 'error',
        message: 'Error de conexión. Inténtalo de nuevo.',
      });
    }
    return null;
  }
};
```

---

## Casos de Prueba

### Escenarios a Probar

#### 1. Sincronización Exitosa
- **Given:** Usuario guest agrega 3 productos válidos
- **When:** Usuario inicia sesión
- **Then:** Todos los productos se agregan al carrito, localStorage se limpia

#### 2. Sincronización con Merge
- **Given:** Usuario autenticado ya tiene 2 productos, luego logout y agrega 2 más como guest
- **When:** Inicia sesión nuevamente
- **Then:** Carrito tiene 4 productos (o 3 si uno era duplicado con cantidades sumadas)

#### 3. Producto Sin Stock
- **Given:** Usuario guest agrega producto con cantidad mayor al stock disponible
- **When:** Usuario inicia sesión
- **Then:** Item falla, se muestra notificación con stock disponible, otros items se sincronizan

#### 4. Producto Eliminado
- **Given:** Usuario guest agrega producto, luego se elimina del catálogo
- **When:** Usuario inicia sesión
- **Then:** Item falla con "Product not found", otros items se sincronizan

#### 5. Talla Inválida
- **Given:** Usuario guest agrega producto con talla "XXL", pero ahora solo hay "S,M,L"
- **When:** Usuario inicia sesión
- **Then:** Item falla con mensaje de tallas disponibles

#### 6. Límite de 50 Items
- **Given:** Usuario guest agrega 60 productos
- **When:** Usuario inicia sesión
- **Then:** Backend retorna error 400, frontend debe dividir en 2 requests

#### 7. Sin Token
- **Given:** Usuario no autenticado intenta llamar /sync
- **When:** Request sin header Authorization
- **Then:** Backend retorna 401 Unauthorized

---

## FAQ

### ¿Qué pasa si el usuario cierra el navegador sin iniciar sesión?

Los items permanecen en `localStorage` hasta que:
- El usuario inicie sesión (se sincronizan)
- El usuario limpie el localStorage manualmente
- El usuario limpie las cookies/datos del sitio

### ¿Se pueden sincronizar más de 50 items?

No en un solo request. El límite es de seguridad. Si tienes más de 50 items, divide en múltiples requests:

```typescript
const syncLargeCart = async (items, token) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += 50) {
    chunks.push(items.slice(i, i + 50));
  }

  for (const chunk of chunks) {
    await syncGuestCart(chunk, token);
  }
};
```

### ¿Qué pasa si el mismo producto + talla ya existe en el carrito autenticado?

El backend suma las cantidades automáticamente, validando que no exceda el stock disponible.

**Ejemplo:**
- Carrito autenticado: Producto A, talla M, cantidad 2
- Carrito guest: Producto A, talla M, cantidad 3
- **Resultado:** Producto A, talla M, cantidad 5 (si hay stock suficiente)

### ¿Debo mostrar el precio del producto en el carrito guest?

**No es necesario**. El backend captura el precio actual al momento de agregar al carrito (campo `priceAtTime`). Esto garantiza que si el precio cambia, el usuario paga el precio correcto.

### ¿Qué pasa si algunos items fallan?

La sincronización continúa procesando todos los items. El endpoint retorna:
- `synced`: Cantidad de éxitos
- `failed`: Array con detalles de fallos
- `cart`: Carrito actualizado con los items exitosos

Tu frontend debe:
1. Mostrar notificación de éxito para items sincronizados
2. Mostrar advertencias específicas para items fallidos
3. Limpiar localStorage solo si algunos items se sincronizaron

### ¿Cómo manejar la expiración del token durante la sincronización?

```typescript
try {
  const result = await syncGuestCart(guestCart, token);
  // ...
} catch (error) {
  if (error.response?.status === 401) {
    // Token expiró, hacer logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Mantener guestCart para no perder items
    router.push('/login?redirect=/cart&message=session-expired');
  }
}
```

### ¿Debo sincronizar inmediatamente después del login o esperar?

**Recomendación:** Sincronizar inmediatamente después del login exitoso, antes de redirigir al usuario. Esto proporciona mejor UX porque:
- El usuario ve su carrito completo de inmediato
- No hay "flash" de carrito vacío seguido de items apareciendo
- Las notificaciones de items fallidos se muestran en contexto

---

## Recursos Adicionales

### Swagger Documentation
- URL: `http://localhost:3000/api`
- Endpoint: `POST /api/cart/sync`

### Endpoints Relacionados
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/items` - Agregar item individual
- `PATCH /api/cart/items/:itemId` - Actualizar cantidad
- `DELETE /api/cart/items/:itemId` - Eliminar item
- `DELETE /api/cart` - Vaciar carrito

### Contacto Backend Team
- Si encuentras bugs o necesitas aclaraciones, crea un issue en el repositorio
- Para cambios en el contrato de API, discute primero con el equipo backend

---

**¡Buena suerte con la implementación! 🚀**
