# Guía Rápida: Notificaciones de Sincronización de Carrito

> **Para:** Equipo Frontend
> **Versión:** 1.0
> **Tiempo de implementación:** ~30 minutos

---

## Índice Rápido

1. [¿Qué necesitas implementar?](#qué-necesitas-implementar)
2. [Sistema de Notificaciones](#sistema-de-notificaciones)
3. [Flujo de Sincronización](#flujo-de-sincronización)
4. [Código Listo para Usar](#código-listo-para-usar)
5. [Ejemplos Visuales](#ejemplos-visuales)

---

## ¿Qué necesitas implementar?

Después de que un usuario inicia sesión, debes:

1. ✅ Sincronizar el carrito guest con el backend
2. ✅ Mostrar notificaciones según el resultado
3. ✅ Limpiar localStorage si corresponde
4. ✅ Actualizar el estado del carrito en la UI

---

## Sistema de Notificaciones

### Tipos de Notificaciones

| Tipo | Cuándo usar | Color sugerido | Duración |
|------|-------------|----------------|----------|
| **success** | Todos los productos se sincronizaron | Verde | 3 seg |
| **warning** | Sincronización parcial (algunos fallaron) | Amarillo | 5 seg |
| **error** | Todos fallaron o error de conexión | Rojo | 7 seg |
| **info** | Información adicional al usuario | Azul | 4 seg |

---

## Flujo de Sincronización

```
Login exitoso
    ↓
¿Hay items en localStorage?
    ↓ Sí
Llamar POST /api/cart/sync
    ↓
Analizar respuesta
    ↓
┌─────────────┬──────────────────┬──────────────────┐
│ Todos OK    │ Parcial          │ Todos fallaron   │
│ synced > 0  │ synced > 0       │ synced === 0     │
│ failed = 0  │ failed > 0       │ failed > 0       │
├─────────────┼──────────────────┼──────────────────┤
│ ✓ Success   │ ⚠ Warning       │ ✗ Error          │
│ Limpiar     │ Limpiar          │ Mantener o       │
│ localStorage│ localStorage     │ Limpiar según    │
│             │ Mostrar detalles │ tipo de error    │
└─────────────┴──────────────────┴──────────────────┘
```

---

## Código Listo para Usar

### 1. Hook de Notificaciones

```typescript
// hooks/useNotifications.ts
import { toast } from 'react-hot-toast'; // o tu librería de notificaciones
// Alternativas: react-toastify, sonner, chakra-ui toast, etc.

interface NotificationOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right';
}

export const useNotifications = () => {
  const showSuccess = (message: string, options?: NotificationOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'top-right',
      icon: '✅',
    });
  };

  const showWarning = (message: string, options?: NotificationOptions) => {
    toast(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      icon: '⚠️',
      style: {
        background: '#FEF3C7',
        color: '#92400E',
        border: '1px solid #FCD34D',
      },
    });
  };

  const showError = (message: string, options?: NotificationOptions) => {
    toast.error(message, {
      duration: options?.duration || 7000,
      position: options?.position || 'top-right',
      icon: '❌',
    });
  };

  const showInfo = (message: string, options?: NotificationOptions) => {
    toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#DBEAFE',
        color: '#1E40AF',
        border: '1px solid #93C5FD',
      },
    });
  };

  return { showSuccess, showWarning, showError, showInfo };
};
```

### 2. Servicio de Sincronización con Notificaciones

```typescript
// services/cartSyncService.ts
import { useNotifications } from '@/hooks/useNotifications';

interface GuestCartItem {
  productId: string;
  quantity: number;
  size: string;
}

interface SyncResult {
  synced: number;
  failed: Array<{
    item: GuestCartItem;
    reason: string;
  }>;
  cart: any;
}

export const useCartSync = () => {
  const { showSuccess, showWarning, showError, showInfo } = useNotifications();

  const syncGuestCart = async (
    guestItems: GuestCartItem[],
    authToken: string
  ): Promise<SyncResult | null> => {
    try {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: guestItems }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          showError('Sesión expirada. Por favor inicia sesión de nuevo.');
          return null;
        }

        if (response.status === 400) {
          const error = await response.json();
          showError(error.message || 'Error al sincronizar el carrito');
          return null;
        }

        throw new Error('Error de conexión');
      }

      const result: SyncResult = await response.json();

      // Analizar resultado y mostrar notificaciones apropiadas
      handleSyncResult(result);

      return result;
    } catch (error) {
      console.error('Sync error:', error);
      showError(
        'No se pudo sincronizar el carrito. Verifica tu conexión e intenta de nuevo.'
      );
      return null;
    }
  };

  const handleSyncResult = (result: SyncResult) => {
    const { synced, failed } = result;

    // CASO 1: Todo exitoso
    if (synced > 0 && failed.length === 0) {
      showSuccess(
        synced === 1
          ? '1 producto agregado a tu carrito'
          : `${synced} productos agregados a tu carrito`
      );
      return;
    }

    // CASO 2: Todos fallaron
    if (synced === 0 && failed.length > 0) {
      // Analizar tipo de fallos
      const allDeleted = failed.every(f => f.reason === 'Product not found');
      const allOutOfStock = failed.every(f => f.reason.includes('Insufficient stock'));

      if (allDeleted) {
        showError(
          failed.length === 1
            ? 'El producto que agregaste ya no está disponible'
            : 'Los productos que agregaste ya no están disponibles'
        );
      } else if (allOutOfStock) {
        showWarning(
          failed.length === 1
            ? 'El producto que agregaste se agotó'
            : 'Los productos que agregaste se agotaron'
        );
      } else {
        showError('No se pudieron agregar los productos a tu carrito');
      }

      // Mostrar detalles en consola para debugging
      console.warn('Failed items:', failed);
      return;
    }

    // CASO 3: Sincronización parcial
    if (synced > 0 && failed.length > 0) {
      showWarning(
        `${synced} producto${synced > 1 ? 's' : ''} agregado${synced > 1 ? 's' : ''}. ` +
        `${failed.length} no ${failed.length > 1 ? 'están disponibles' : 'está disponible'}.`
      );

      // Opcional: Mostrar notificación adicional con detalles
      setTimeout(() => {
        const deletedCount = failed.filter(f => f.reason === 'Product not found').length;
        const outOfStockCount = failed.filter(f => f.reason.includes('Insufficient stock')).length;

        if (deletedCount > 0 || outOfStockCount > 0) {
          const details: string[] = [];
          if (deletedCount > 0) details.push(`${deletedCount} eliminado${deletedCount > 1 ? 's' : ''}`);
          if (outOfStockCount > 0) details.push(`${outOfStockCount} sin stock`);

          showInfo(`Detalles: ${details.join(', ')}`);
        }
      }, 1000);

      return;
    }
  };

  return { syncGuestCart };
};
```

### 3. Integración en el Login

```typescript
// pages/login.tsx o components/LoginForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCartSync } from '@/services/cartSyncService';
import { useCartStore } from '@/store/cartStore';

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { syncGuestCart } = useCartSync();
  const { setCart } = useCartStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Login
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Credenciales inválidas');
      }

      const { token, user } = await loginResponse.json();

      // 2. Guardar token
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 3. Sincronizar carrito guest (si existe)
      const guestCartJson = localStorage.getItem('guestCart');

      if (guestCartJson) {
        try {
          const guestCart = JSON.parse(guestCartJson);

          if (Array.isArray(guestCart) && guestCart.length > 0) {
            const syncResult = await syncGuestCart(guestCart, token);

            if (syncResult) {
              // Actualizar carrito en el estado global
              setCart(syncResult.cart);

              // Limpiar localStorage solo si la sincronización fue exitosa
              localStorage.removeItem('guestCart');
            }
          }
        } catch (error) {
          console.error('Error parsing guest cart:', error);
          localStorage.removeItem('guestCart');
        }
      } else {
        // No hay carrito guest, obtener carrito del usuario
        const cartResponse = await fetch('/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const cart = await cartResponse.json();
        setCart(cart);
      }

      // 4. Redirigir
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      // Mostrar error de login (usa tu sistema de notificaciones)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};
```

### 4. Hook para Agregar al Carrito (Guest o Autenticado)

```typescript
// hooks/useAddToCart.ts
import { useNotifications } from './useNotifications';
import { useCartStore } from '@/store/cartStore';

interface AddToCartParams {
  productId: string;
  quantity: number;
  size: string;
}

export const useAddToCart = () => {
  const { showSuccess, showError } = useNotifications();
  const { addToCart, isAuthenticated, authToken } = useCartStore();

  const addProductToCart = async ({
    productId,
    quantity,
    size,
  }: AddToCartParams) => {
    try {
      if (isAuthenticated && authToken) {
        // Usuario autenticado: agregar directamente al backend
        const response = await fetch('/api/cart/items', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity, size }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al agregar al carrito');
        }

        const updatedCart = await response.json();
        addToCart(updatedCart);

        showSuccess('Producto agregado al carrito');
      } else {
        // Usuario guest: agregar a localStorage
        const guestCartJson = localStorage.getItem('guestCart') || '[]';
        const guestCart = JSON.parse(guestCartJson);

        // Buscar si ya existe
        const existingIndex = guestCart.findIndex(
          (item: any) => item.productId === productId && item.size === size
        );

        if (existingIndex !== -1) {
          guestCart[existingIndex].quantity += quantity;
        } else {
          guestCart.push({ productId, quantity, size });
        }

        localStorage.setItem('guestCart', JSON.stringify(guestCart));

        showSuccess(
          'Producto agregado (inicia sesión para guardar tu carrito)',
          { duration: 4000 }
        );
      }
    } catch (error: any) {
      console.error('Add to cart error:', error);
      showError(error.message || 'No se pudo agregar el producto');
    }
  };

  return { addProductToCart };
};
```

---

## Ejemplos Visuales

### Notificación de Éxito Total

```
┌─────────────────────────────────────────┐
│ ✅  3 productos agregados a tu carrito  │
└─────────────────────────────────────────┘
Verde • 3 segundos • Top right
```

### Notificación de Sincronización Parcial

```
┌──────────────────────────────────────────────────┐
│ ⚠️  2 productos agregados.                      │
│     1 no está disponible.                        │
└──────────────────────────────────────────────────┘
Amarillo • 5 segundos • Top right

┌──────────────────────────────────────────────────┐
│ ℹ️  Detalles: 1 sin stock                       │
└──────────────────────────────────────────────────┘
Azul • 4 segundos • Top right (1 segundo después)
```

### Notificación de Todos Fallidos (Productos Eliminados)

```
┌──────────────────────────────────────────────────┐
│ ❌  Los productos que agregaste ya no están     │
│     disponibles                                  │
└──────────────────────────────────────────────────┘
Rojo • 7 segundos • Top right
```

### Notificación de Todos Fallidos (Sin Stock)

```
┌──────────────────────────────────────────────────┐
│ ⚠️  Los productos que agregaste se agotaron     │
└──────────────────────────────────────────────────┘
Amarillo • 7 segundos • Top right
```

### Notificación Guest (Sin Autenticar)

```
┌──────────────────────────────────────────────────┐
│ ✅  Producto agregado                           │
│     (inicia sesión para guardar tu carrito)     │
└──────────────────────────────────────────────────┘
Verde • 4 segundos • Top right
```

---

## Instalación de Dependencias

### Opción 1: React Hot Toast (Recomendado)

```bash
npm install react-hot-toast
# o
yarn add react-hot-toast
```

**Configuración en _app.tsx:**
```tsx
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </>
  );
}
```

### Opción 2: React Toastify

```bash
npm install react-toastify
# o
yarn add react-toastify
```

**Configuración:**
```tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Component {...pageProps} />
    </>
  );
}
```

### Opción 3: Sonner (Más moderno)

```bash
npm install sonner
# o
yarn add sonner
```

**Configuración:**
```tsx
import { Toaster } from 'sonner';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </>
  );
}
```

---

## Checklist de Implementación

- [ ] Instalar librería de notificaciones
- [ ] Configurar `<Toaster />` en _app.tsx
- [ ] Crear hook `useNotifications`
- [ ] Crear servicio `useCartSync`
- [ ] Integrar en el flujo de login
- [ ] Probar escenario: Todos los productos exitosos
- [ ] Probar escenario: Algunos productos sin stock
- [ ] Probar escenario: Todos los productos eliminados
- [ ] Probar escenario: Usuario sin items guest
- [ ] Probar escenario: Error de conexión
- [ ] Verificar que localStorage se limpia correctamente
- [ ] Verificar que el carrito se actualiza en la UI

---

## Respuestas del Backend (Referencia Rápida)

### Caso 1: Todos exitosos
```json
{
  "synced": 3,
  "failed": [],
  "cart": { ... }
}
```
→ Mostrar: `✅ 3 productos agregados a tu carrito`

### Caso 2: Sincronización parcial
```json
{
  "synced": 2,
  "failed": [
    {
      "item": { "productId": "...", "quantity": 1, "size": "M" },
      "reason": "Insufficient stock. Available: 0, Requested: 1"
    }
  ],
  "cart": { ... }
}
```
→ Mostrar: `⚠️ 2 productos agregados. 1 no está disponible.`

### Caso 3: Todos fallidos
```json
{
  "synced": 0,
  "failed": [
    {
      "item": { "productId": "...", "quantity": 2, "size": "L" },
      "reason": "Product not found"
    },
    {
      "item": { "productId": "...", "quantity": 1, "size": "XL" },
      "reason": "Product not found"
    }
  ],
  "cart": { ... }
}
```
→ Mostrar: `❌ Los productos que agregaste ya no están disponibles`

---

## Soporte

**¿Preguntas?** Contacta al equipo backend o crea un issue en el repositorio.

**Documentación completa:** Ver `FRONTEND_CART_SYNC_GUIDE.md`

---

**¡Listo para implementar! 🚀**
