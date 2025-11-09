# ANÁLISIS ESTRATÉGICO COMPLETO - FEATURE DE CARRITO

> Resultado del análisis del agente `ecommerce-feature-strategist` - Paso 2 del workflow

**Fecha:** 2025-11-01
**Stack:** React + TypeScript + Tailwind + shadcn/ui + React Query + Zustand

---

## RESUMEN EJECUTIVO

### MVP (Prioridad 1)
- **Inversión:** 37 Story Points / 25-30 horas (1 semana)
- **ROI:** CRÍTICO - Sin carrito no hay e-commerce
- **Impacto:** Funcionalidad core completamente operativa

### Post-MVP (Prioridad 2)
- **Inversión:** 16 SP / 10-12 horas (3-4 días)
- **ROI:** ALTO - Mejora significativa de UX
- **Impacto:** Reducción de abandono de carrito

### Features Avanzados (Prioridad 3)
- **Inversión:** 19 SP / 12-15 horas (1 semana)
- **ROI:** MEDIO-ALTO - Incremento de conversión
- **Impacto:** Retención, cross-selling

---

## 1. FUNCIONALIDADES CORE DEL MVP

### 1.1 Estructura Base del Feature de Carrito
**Esfuerzo:** 3 SP / 2-3 horas / Complejidad MEDIA

**Descripción:** Crear estructura completa del feature siguiendo patrón existente.

**Estructura a crear:**
```
src/cart/
├── components/
│   ├── CartIcon.tsx
│   ├── CartDrawer.tsx
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   └── SizeSelectDialog.tsx
├── hooks/
│   ├── useCart.tsx
│   └── useCartMutations.tsx
├── repositories/
│   ├── ICartRepository.ts
│   └── CartApiRepository.ts
├── services/
│   ├── CartService.ts
│   └── CartErrorService.ts
├── types/
│   └── cart.types.ts
└── config/
    └── cart.config.ts
```

**Justificación:**
- Impacto en conversión: **CRÍTICO**
- Relación beneficio/esfuerzo: **ALTA**
- Riesgos: Ninguno, es estructura base

---

### 1.2 Tipos e Interfaces del Carrito
**Esfuerzo:** 2 SP / 1 hora / Complejidad BAJA

**Descripción:** Definir tipos TypeScript para CartItem, Cart, DTOs.

**Implementación:**
```typescript
// cart/types/cart.types.ts

export interface CartItem {
  id: string;                    // ID del item en carrito
  productId: string;             // ID del producto
  product: Product;              // Snapshot del producto
  quantity: number;              // Cantidad seleccionada
  size: Size;                    // Talla REQUERIDA
  priceAtTime: number;           // Precio cuando se agregó
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;              // Calculado en servidor
  tax: number;                   // Impuestos (configurable)
  discount: number;              // Descuentos aplicados
  total: number;                 // Total final
  updatedAt: Date;
}

// DTOs para mutaciones
export interface AddCartItemDto {
  productId: string;
  quantity: number;
  size: Size;
}

export interface UpdateCartItemDto {
  quantity: number;
  size?: Size;
}
```

**Consideraciones:**
- `priceAtTime` permite detectar cambios de precio
- `product` es snapshot para evitar perder info si producto se elimina
- `size` debe ser REQUERIDA (validación estricta)

---

### 1.3 Repository del Carrito
**Esfuerzo:** 5 SP / 3-4 horas / Complejidad MEDIA

**Descripción:** Implementar ICartRepository + CartApiRepository para comunicación con backend.

**Implementación:**

```typescript
// repositories/ICartRepository.ts
export interface ICartRepository {
  getCart(): Promise<Cart>;
  addItem(data: AddCartItemDto): Promise<Cart>;
  updateItem(itemId: string, data: UpdateCartItemDto): Promise<Cart>;
  removeItem(itemId: string): Promise<Cart>;
  clearCart(): Promise<void>;
}

// repositories/CartApiRepository.ts
import { gymApi } from '@/api/gymApi';
import type { Cart, AddCartItemDto, UpdateCartItemDto } from '../types/cart.types';
import type { ICartRepository } from './ICartRepository';

export class CartApiRepository implements ICartRepository {
  constructor(private api: typeof gymApi) {}

  async getCart(): Promise<Cart> {
    const { data } = await this.api.get<Cart>('/cart');
    return data;
  }

  async addItem(itemData: AddCartItemDto): Promise<Cart> {
    const { data } = await this.api.post<Cart>('/cart/items', itemData);
    return data;
  }

  async updateItem(itemId: string, updateData: UpdateCartItemDto): Promise<Cart> {
    const { data } = await this.api.patch<Cart>(`/cart/items/${itemId}`, updateData);
    return data;
  }

  async removeItem(itemId: string): Promise<Cart> {
    const { data } = await this.api.delete<Cart>(`/cart/items/${itemId}`);
    return data;
  }

  async clearCart(): Promise<void> {
    await this.api.delete('/cart');
  }
}

// repositories/index.ts
import { gymApi } from '@/api/gymApi';
import { CartApiRepository } from './CartApiRepository';

export const cartRepository = new CartApiRepository(gymApi);
```

**Endpoints API requeridos:**
```
GET    /cart
POST   /cart/items
PATCH  /cart/items/:itemId
DELETE /cart/items/:itemId
DELETE /cart
```

---

### 1.4 Hooks con React Query
**Esfuerzo:** 5 SP / 3-4 horas / Complejidad MEDIA-ALTA

**Descripción:** Crear useCart (lectura) y useCartMutations (escritura).

**Implementación:**

```typescript
// hooks/useCart.tsx (READ)
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/auth/store/auth.store';
import { cartRepository } from '../repositories';

export const useCart = () => {
  const { authStatus } = useAuthStore();

  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartRepository.getCart(),
    enabled: authStatus === 'authenticated',
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
};

// hooks/useCartMutations.tsx (WRITE)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartRepository } from '../repositories';
import type { AddCartItemDto, UpdateCartItemDto, Cart } from '../types/cart.types';

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const addItem = useMutation({
    mutationFn: (data: AddCartItemDto) => cartRepository.addItem(data),

    // Optimistic update
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      const previousCart = queryClient.getQueryData<Cart>(['cart']);

      // Actualizar caché optimísticamente
      if (previousCart) {
        queryClient.setQueryData<Cart>(['cart'], (old) => {
          if (!old) return old;
          // Agregar item preview (simplificado)
          return {
            ...old,
            items: [...old.items, newItem as any],
          };
        });
      }

      return { previousCart };
    },

    onError: (err, newItem, context) => {
      // Rollback en caso de error
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      toast.error('Error al agregar al carrito');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Producto agregado al carrito');
    },
  });

  const updateItem = useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemDto }) =>
      cartRepository.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => cartRepository.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Producto eliminado del carrito');
    },
  });

  const clearCart = useMutation({
    mutationFn: () => cartRepository.clearCart(),
    onSuccess: () => {
      queryClient.setQueryData(['cart'], null);
      toast.success('Carrito vaciado');
    },
  });

  return {
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isAddingItem: addItem.isPending,
    isUpdatingItem: updateItem.isPending,
    isRemovingItem: removeItem.isPending,
  };
};
```

**Consideraciones:**
- Optimistic updates mejoran UX (feedback instantáneo)
- Rollback automático en errores
- Toast notifications para feedback

---

### 1.5 CartService (Lógica de Negocio)
**Esfuerzo:** 3 SP / 2 horas / Complejidad BAJA-MEDIA

**Descripción:** Servicio para cálculos y validaciones.

**Implementación:**

```typescript
// services/CartService.ts
import type { Cart, CartItem } from '../types/cart.types';
import type { Product } from '@/shared/types';

export class CartService {
  static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + (item.priceAtTime * item.quantity), 0);
  }

  static calculateTax(subtotal: number, taxRate: number = 0.16): number {
    return subtotal * taxRate;
  }

  static calculateTotal(subtotal: number, tax: number, discount: number = 0): number {
    return subtotal + tax - discount;
  }

  static getTotalItems(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }

  static validateQuantity(quantity: number, stock: number): boolean {
    return quantity > 0 && quantity <= stock;
  }

  static hasPriceChanged(cartItem: CartItem, currentPrice: number): boolean {
    return cartItem.priceAtTime !== currentPrice;
  }

  static getItemsWithPriceChanges(cart: Cart, products: Product[]): CartItem[] {
    const productMap = new Map(products.map(p => [p.id, p]));

    return cart.items.filter(item => {
      const currentProduct = productMap.get(item.productId);
      return currentProduct && this.hasPriceChanged(item, currentProduct.price);
    });
  }
}
```

**Nota:** Estos cálculos son para preview en UI. El servidor es la fuente de verdad.

---

### 1.6 CartIcon con Badge en Header
**Esfuerzo:** 2 SP / 1-2 horas / Complejidad BAJA

**Descripción:** Ícono del carrito mostrando cantidad de items.

**Implementación:**

```typescript
// cart/components/CartIcon.tsx
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../hooks/useCart';

interface CartIconProps {
  onOpen: () => void;
}

export const CartIcon = ({ onOpen }: CartIconProps) => {
  const { data: cart, isLoading } = useCart();

  const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onOpen}
      className="relative"
      aria-label={`Carrito de compras, ${itemCount} items`}
    >
      <ShoppingCart className="h-5 w-5" />

      {itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          aria-hidden="true"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Button>
  );
};
```

**Integración en CustomHeader.tsx (línea 100):**
```typescript
import { CartIcon } from '@/cart/components/CartIcon';
import { CartDrawer } from '@/cart/components/CartDrawer';
import { useState } from 'react';

// Dentro del componente:
const [isCartOpen, setIsCartOpen] = useState(false);

// En el JSX:
<div className="hidden md:flex items-center gap-3 lg:gap-4">
  {authStatus === 'authenticated' && (
    <>
      <CartIcon onOpen={() => setIsCartOpen(true)} />
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )}
  {/* Auth buttons existentes... */}
</div>
```

---

### 1.7 CartDrawer (Sheet Lateral)
**Esfuerzo:** 5 SP / 4-5 horas / Complejidad MEDIA

**Descripción:** Drawer lateral con Sheet de shadcn.

**Implementación:**

```typescript
// cart/components/CartDrawer.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCart } from '../hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { data: cart, isLoading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/checkout'); // Ruta futura
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Mi Carrito
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Cargando carrito...</p>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
            <Button onClick={() => onOpenChange(false)}>
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            {/* Lista de items - scrollable */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <Separator />

            {/* Summary y acciones */}
            <SheetFooter className="flex-col gap-4">
              <CartSummary cart={cart} />

              <div className="flex flex-col gap-2 w-full">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceder al pago
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full"
                >
                  Seguir comprando
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
```

**Características:**
- Sheet desde la derecha
- Contenido scrollable
- Empty state cuando no hay items
- Footer sticky con summary y botones

---

### 1.8 CartItem Component
**Esfuerzo:** 5 SP / 3-4 horas / Complejidad MEDIA

**Descripción:** Componente individual para cada item.

**Implementación:**

```typescript
// cart/components/CartItem.tsx
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCartMutations } from '../hooks/useCartMutations';
import type { CartItem as CartItemType } from '../types/cart.types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateItem, removeItem } = useCartMutations();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) {
      toast.error('Stock insuficiente');
      return;
    }

    updateItem.mutate({
      itemId: item.id,
      data: { quantity: newQuantity },
    });
  };

  const handleRemove = () => {
    removeItem.mutate(item.id);
  };

  return (
    <div className="flex gap-4">
      {/* Imagen */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <img
          src={item.product.images[0]}
          alt={item.product.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Detalles */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium">{item.product.title}</h4>
            <p className="text-xs text-muted-foreground">
              Talla: {item.size}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={removeItem.isPending}
            aria-label="Eliminar del carrito"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          {/* Controles de cantidad */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || updateItem.isPending}
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock || updateItem.isPending}
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Precio */}
          <p className="text-sm font-semibold">
            ${(item.priceAtTime * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
```

**Características:**
- Validación de stock antes de incrementar
- Botones disabled durante mutaciones
- Precio multiplicado por cantidad
- Accesibilidad con aria-labels

---

### 1.9 CartSummary Component
**Esfuerzo:** 2 SP / 1-2 horas / Complejidad BAJA

**Descripción:** Resumen con subtotal, impuestos y total.

**Implementación:**

```typescript
// cart/components/CartSummary.tsx
import type { Cart } from '../types/cart.types';

interface CartSummaryProps {
  cart: Cart;
}

export const CartSummary = ({ cart }: CartSummaryProps) => {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
      </div>

      {cart.tax > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Impuestos (16%)</span>
          <span className="font-medium">${cart.tax.toFixed(2)}</span>
        </div>
      )}

      {cart.discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Descuento</span>
          <span className="font-medium">-${cart.discount.toFixed(2)}</span>
        </div>
      )}

      <div className="border-t pt-2 flex justify-between text-base font-bold">
        <span>Total</span>
        <span>${cart.total.toFixed(2)}</span>
      </div>
    </div>
  );
};
```

---

### 1.10 Integrar "Agregar al Carrito" en ProductCard
**Esfuerzo:** 5 SP / 3-4 horas / Complejidad MEDIA

**Descripción:** Modificar ProductCard para usar carrito + modal de tallas.

**Implementación:**

**Paso 1: Crear SizeSelectDialog**
```typescript
// cart/components/SizeSelectDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Size } from '@/shared/types';

interface SizeSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sizes: Size[];
  productName: string;
  onSizeSelect: (size: Size) => void;
}

export const SizeSelectDialog = ({
  open,
  onOpenChange,
  sizes,
  productName,
  onSizeSelect,
}: SizeSelectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecciona una talla</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 py-4">
          {sizes.map((size) => (
            <Button
              key={size}
              variant="outline"
              className="h-12 text-base font-medium hover:bg-primary hover:text-primary-foreground"
              onClick={() => onSizeSelect(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

**Paso 2: Modificar ProductCard.tsx**
```typescript
// En ProductCard.tsx (agregar imports)
import { useCartMutations } from '@/cart/hooks/useCartMutations';
import { SizeSelectDialog } from '@/cart/components/SizeSelectDialog';
import { useState } from 'react';

// Dentro del componente ProductCard:
const { addItem } = useCartMutations();
const [showSizeDialog, setShowSizeDialog] = useState(false);

const handleAddToCart = (e: React.MouseEvent) => {
  e.stopPropagation();
  setShowSizeDialog(true);
};

const handleSizeSelected = (selectedSize: Size) => {
  addItem.mutate({
    productId: id,
    quantity: 1,
    size: selectedSize,
  });
  setShowSizeDialog(false);
};

// En el return, después del Card:
return (
  <>
    <Card>
      {/* código existente... */}
      <Button onClick={handleAddToCart}>
        Agregar al carrito
      </Button>
    </Card>

    <SizeSelectDialog
      open={showSizeDialog}
      onOpenChange={setShowSizeDialog}
      sizes={sizes}
      productName={name}
      onSizeSelect={handleSizeSelected}
    />
  </>
);
```

---

## RESUMEN MVP

| # | Funcionalidad | Esfuerzo | Orden |
|---|--------------|----------|-------|
| 1.1 | Estructura Base | 3 SP / 2-3h | 1 |
| 1.2 | Tipos e Interfaces | 2 SP / 1h | 2 |
| 1.3 | Repository | 5 SP / 3-4h | 3 |
| 1.4 | Hooks React Query | 5 SP / 3-4h | 4 |
| 1.5 | CartService | 3 SP / 2h | 5 |
| 1.6 | CartIcon | 2 SP / 1-2h | 6 |
| 1.7 | CartDrawer | 5 SP / 4-5h | 7 |
| 1.8 | CartItem | 5 SP / 3-4h | 8 |
| 1.9 | CartSummary | 2 SP / 1-2h | 9 |
| 1.10 | Integrar ProductCard | 5 SP / 3-4h | 10 |

**Total MVP: 37 Story Points / 25-30 horas**

---

## 2. FUNCIONALIDADES POST-MVP (PRIORIDAD 2)

### 2.1 Página Dedicada del Carrito
**Esfuerzo:** 5 SP / 3-4 horas

- Ruta `/cart`
- Reutilizar CartItem, CartSummary
- Layout más amplio que drawer
- Mejor para muchos items

### 2.2 Notificación de Cambios de Precio
**Esfuerzo:** 3 SP / 2 horas

```typescript
// En CartItem.tsx, agregar:
{item.priceAtTime !== item.product.price && (
  <Alert variant="warning" className="mt-2">
    <AlertTriangle className="h-4 w-4" />
    <AlertDescription>
      El precio cambió de ${item.priceAtTime} a ${item.product.price}
    </AlertDescription>
  </Alert>
)}
```

### 2.3 Validación de Stock en Tiempo Real
**Esfuerzo:** 3 SP / 2 horas

```typescript
{item.quantity > item.product.stock && (
  <Alert variant="destructive">
    <AlertDescription>
      Solo quedan {item.product.stock} unidades disponibles
    </AlertDescription>
  </Alert>
)}
```

### 2.4 Responsive Móvil
**Esfuerzo:** 3 SP / 2-3 horas

- CartIcon en MobileNav
- Sheet full-width en móvil
- Botones más grandes (touch-friendly)

### 2.5 Animaciones
**Esfuerzo:** 2 SP / 2 horas

- Fade in/out items
- Badge pulse al agregar
- Smooth transitions

---

## 3. FUNCIONALIDADES AVANZADAS (PRIORIDAD 3)

### 3.1 localStorage para No Autenticados
**Esfuerzo:** 8 SP / 5-6 horas

- Persistir en localStorage
- Merge al hacer login
- Endpoint: `POST /cart/merge`

### 3.2 Botón en ProductPage
**Esfuerzo:** 3 SP / 2 horas

- Selector de talla con RadioGroup
- Botón disabled hasta seleccionar talla

### 3.3 Editar Talla
**Esfuerzo:** 3 SP / 2 horas

- Select component en CartItem
- Permite cambiar talla sin eliminar

### 3.4 Cupones de Descuento
**Esfuerzo:** 8 SP / 5-6 horas

- Input para código
- Validación en servidor
- Endpoint: `POST /cart/apply-coupon`

### 3.5 Productos Recomendados
**Esfuerzo:** 8 SP / 5-6 horas

- "También te puede interesar"
- Algoritmo en backend
- Endpoint: `GET /cart/recommended-products`

---

## 4. ENDPOINTS API NECESARIOS

### 4.1 Obtener Carrito
```
GET /api/cart
Headers: Authorization: Bearer {JWT}

Response 200:
{
  "id": "uuid",
  "userId": "uuid",
  "items": [...],
  "subtotal": 59.98,
  "tax": 9.60,
  "discount": 0,
  "total": 69.58,
  "updatedAt": "2025-11-01T12:00:00Z"
}
```

### 4.2 Agregar Item
```
POST /api/cart/items
Body: { "productId": "uuid", "quantity": 1, "size": "M" }

Response 201: { ...Cart actualizado }
Response 400: { "message": "Stock insuficiente", "error": "INSUFFICIENT_STOCK" }
```

### 4.3 Actualizar Item
```
PATCH /api/cart/items/:itemId
Body: { "quantity"?: 2, "size"?: "L" }

Response 200: { ...Cart actualizado }
```

### 4.4 Eliminar Item
```
DELETE /api/cart/items/:itemId

Response 200: { ...Cart actualizado }
```

### 4.5 Vaciar Carrito
```
DELETE /api/cart

Response 204: No Content
```

---

## 5. DECISIONES DE ARQUITECTURA

### UI: Drawer + Página (Híbrido)
- **MVP:** Solo CartDrawer (Sheet lateral)
- **Post-MVP:** Agregar página `/cart`

### Persistencia: Servidor + localStorage
- **MVP:** Carrito en servidor (usuarios autenticados)
- **P3:** localStorage para no autenticados + merge al login

### Estado: React Query (NO Zustand)
- Carrito es dato remoto
- React Query maneja caché automático
- Optimistic updates
- Sincronización automática

### Validación: Cliente + Servidor
- **Cliente:** Preventiva (UX, botones disabled)
- **Servidor:** Autoritativa (seguridad, fuente de verdad)

---

## 6. DESAFÍOS TÉCNICOS

### 6.1 Sincronización Cliente ↔ Servidor
**Solución:** React Query
- staleTime: 5 minutos
- Invalidación tras mutaciones
- Optimistic updates con rollback

### 6.2 Manejo de Errores
**Estrategia:**
- Prevención (cliente): Validación preventiva
- Detección (servidor): Códigos de error específicos
- Recuperación (cliente): Toast + revalidación

### 6.3 Optimistic Updates
**Cuándo usar:**
- ✅ Agregar item
- ✅ Cambiar cantidad
- ❌ Eliminar item (mostrar loading)
- ❌ Aplicar cupón (requiere validación)

### 6.4 Validación de Tallas
**Estrategia:**
- ProductCard: Modal obligatorio
- ProductPage: RadioGroup + botón disabled
- Backend: DTO con validación @IsEnum

---

## 7. PLAN DE SPRINTS

### SPRINT 1: MVP (1 semana)
1. Crear estructura de carpetas
2. Definir tipos
3. Implementar Repository
4. Implementar Service
5. Crear hooks React Query
6. Implementar CartIcon
7. Implementar CartSummary
8. Implementar CartItem
9. Implementar CartDrawer
10. Integrar en CustomHeader
11. Crear SizeSelectDialog
12. Modificar ProductCard
13. Testing manual

**Entregable:** Carrito funcional completo

### SPRINT 2: UX (3-4 días)
1. Página `/cart`
2. Alertas precio/stock
3. Responsive móvil
4. Animaciones
5. Botón en ProductPage
6. Testing móvil

**Entregable:** UX pulida y responsive

### SPRINT 3: Avanzado (1 semana)
1. localStorage + merge
2. Editar talla
3. Cupones
4. Productos recomendados

**Entregable:** Features de retención y cross-selling

---

## 8. MÉTRICAS DE ÉXITO

### Técnicas:
- Tiempo de carga < 200ms
- Tasa de error < 1%
- Coverage tests > 80%
- Lighthouse Performance > 90

### Negocio:
- Agregar al carrito > 15%
- Abandono < 70%
- Valor promedio > $80
- Conversión carrito → compra > 30%

---

## PRÓXIMOS PASOS

1. Revisar documento con equipo (30 min)
2. Coordinar endpoints con backend (1 hora)
3. Crear tasks en tablero (1 hora)
4. Iniciar Sprint 1

---

**Total estimado completo:** 72 SP / ~2 semanas
**Archivo generado:** 2025-11-01
**Agente:** ecommerce-feature-strategist
