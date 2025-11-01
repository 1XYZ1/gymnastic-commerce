# FRONTEND CART - PLAN DE IMPLEMENTACIÓN (PASO 3)

> Plan detallado con agentes y uso de Context7 MCP para documentación actualizada

**Stack:** React 19 + TypeScript + Vite + Tailwind + shadcn/ui + React Query + Zustand
**Tiempo estimado:** 25-30 horas
**Prerequisito:** Backend con endpoints funcionando

---

## IMPORTANTE: USO DE CONTEXT7 MCP

Cada agente DEBE consultar Context7 ANTES de implementar para obtener documentación actualizada 2025 de:

| Biblioteca | Usar en Tasks |
|------------|---------------|
| `@tanstack/react-query` | 4, 5, 6 |
| `shadcn/ui` (Sheet, Dialog, Button) | 7, 8, 9, 10, 11 |
| `React Router` | 11 |
| `TypeScript` best practices | 2, 3 |

**Cómo usar Context7:**
```
1. Usar mcp__context7__resolve-library-id para obtener el ID
2. Usar mcp__context7__get-library-docs con el ID obtenido
3. Leer la documentación antes de escribir código
```

---

## FASES DE IMPLEMENTACIÓN

### FASE 1: SETUP Y TIPOS (1-2 horas)

#### Task 1: Crear estructura de carpetas
**Agente:** MANUAL (sin agente)
**Duración:** 15 min

```bash
mkdir -p src/cart/{components,hooks,repositories,services,types,config}
touch src/cart/types/cart.types.ts
touch src/cart/config/cart.config.ts
touch src/cart/repositories/{ICartRepository.ts,CartApiRepository.ts,index.ts}
touch src/cart/services/{CartService.ts,CartErrorService.ts}
touch src/cart/hooks/{useCart.tsx,useCartMutations.tsx}
touch src/cart/components/{CartIcon.tsx,CartDrawer.tsx,CartItem.tsx,CartSummary.tsx,SizeSelectDialog.tsx}
```

**Checklist:**
- [ ] Carpetas creadas
- [ ] Archivos vacíos creados

---

#### Task 2: Definir tipos TypeScript
**Agente:** `react-tailwind-dev`
**Duración:** 45 min

**PROMPT:**
```
INSTRUCCIÓN OBLIGATORIA: Antes de implementar, usa Context7 MCP:
1. Buscar: "@tanstack/react-query" para entender tipos de datos
2. Buscar: "TypeScript best practices 2025"

TAREA:
Implementa src/cart/types/cart.types.ts con:

1. Importar Size y Product desde @/shared/types
2. Definir interfaces:
   - CartItem (id, productId, product, quantity, size, priceAtTime)
   - Cart (id, userId, items, subtotal, tax, discount, total, updatedAt)
   - AddCartItemDto (productId, quantity, size)
   - UpdateCartItemDto (quantity, size?)

REQUISITOS:
- Usar interfaces (no types)
- Todos los campos con comentarios JSDoc
- size es REQUERIDA (no opcional)
- priceAtTime type: number

REFERENCIA: Revisar src/shared/types/product.types.ts como modelo
```

**Archivo:** `src/cart/types/cart.types.ts`

**Verificación:**
- [ ] Interfaces definidas
- [ ] JSDoc agregado
- [ ] Sin errores TypeScript

---

### FASE 2: DATA ACCESS (2 horas)

#### Task 3: Repository Pattern
**Agente:** `clean-architecture-code-reviewer`
**Duración:** 2 horas

**PROMPT:**
```
INSTRUCCIÓN OBLIGATORIA: Revisa src/auth/repositories/ como REFERENCIA del patrón.

TAREA:
Implementa Repository Pattern en 3 archivos:

1. src/cart/repositories/ICartRepository.ts
   - Interface con métodos: getCart(), addItem(), updateItem(), removeItem(), clearCart()

2. src/cart/repositories/CartApiRepository.ts
   - Implementa ICartRepository
   - Constructor: constructor(private api: AxiosInstance)
   - Endpoints:
     * GET /cart
     * POST /cart/items
     * PATCH /cart/items/:itemId
     * DELETE /cart/items/:itemId
     * DELETE /cart
   - Tipar respuestas: await this.api.get<Cart>(...)

3. src/cart/repositories/index.ts
   - Export singleton: export const cartRepository = new CartApiRepository(gymApi)

REQUISITOS:
- Seguir EXACTAMENTE patrón de src/auth/repositories/
- Importar gymApi de @/api/gymApi
- Todos los métodos async con tipos de retorno
- NO manejar errores aquí (eso va en Services)

VERIFICACIÓN:
- Cumple Dependency Inversion Principle
- Fácilmente testeable
```

**Archivos:**
- `src/cart/repositories/ICartRepository.ts`
- `src/cart/repositories/CartApiRepository.ts`
- `src/cart/repositories/index.ts`

**Verificación:**
- [ ] Interface definida
- [ ] Implementación completa
- [ ] Singleton exportado
- [ ] Patrón consistente con auth

---

### FASE 3: BUSINESS LOGIC (1.5 horas)

#### Task 4: CartService
**Agente:** `clean-architecture-code-reviewer`
**Duración:** 1.5 horas

**PROMPT:**
```
REFERENCIA: Revisar src/auth/services/AuthService.ts

TAREA:
Implementa src/cart/services/CartService.ts con métodos STATIC:

CÁLCULOS:
- calculateSubtotal(items: CartItem[]): number
- calculateTax(subtotal: number, taxRate = 0.16): number
- calculateTotal(subtotal, tax, discount): number
- getTotalItems(items: CartItem[]): number

VALIDACIONES:
- validateQuantity(quantity: number, stock: number): boolean
- hasPriceChanged(cartItem: CartItem, currentPrice: number): boolean

UTILIDADES:
- formatPrice(price: number): string (ejemplo: $29.99)

IMPORTANTE:
- Métodos STATIC (clase como namespace)
- Funciones PURAS (sin side effects)
- NO usar React hooks
- Estos cálculos son para UI (servidor es fuente de verdad)
```

**Archivo:** `src/cart/services/CartService.ts`

**Verificación:**
- [ ] Métodos static implementados
- [ ] Funciones puras
- [ ] JSDoc en métodos

---

### FASE 4: REACT QUERY HOOKS (3 horas)

#### Task 5: useCart (READ)
**Agente:** `react-tailwind-dev`
**Duración:** 1 hora

**PROMPT:**
```
INSTRUCCIÓN OBLIGATORIA: Usar Context7 MCP:
1. Buscar: "@tanstack/react-query"
2. Enfoque: useQuery, queryKey, queryFn, enabled, staleTime

REFERENCIA: src/shop/hooks/useProducts.tsx (REVISAR)

TAREA:
Implementa src/cart/hooks/useCart.tsx:

```typescript
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/auth/store/auth.store';
import { cartRepository } from '../repositories';

export const useCart = () => {
  const { authStatus } = useAuthStore();

  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartRepository.getCart(),
    enabled: authStatus === 'authenticated',
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 1,
  });
};
```

REQUISITOS React Query v5:
- queryKey: array
- enabled: solo si autenticado
- staleTime: 5 minutos
- retry: 1

VERIFICACIÓN:
- Hook retorna { data, isLoading, error, refetch }
- No fetch si no autenticado
```

**Archivo:** `src/cart/hooks/useCart.tsx`

**Verificación:**
- [ ] useQuery correcto
- [ ] enabled funciona
- [ ] Sintaxis React Query v5

---

#### Task 6: useCartMutations (WRITE)
**Agente:** `react-tailwind-dev`
**Duración:** 2 horas

**PROMPT:**
```
INSTRUCCIÓN OBLIGATORIA: Usar Context7 MCP:
1. Buscar: "@tanstack/react-query" sobre useMutation
2. Buscar: "optimistic updates React Query v5"

TAREA:
Implementa src/cart/hooks/useCartMutations.tsx con 4 mutaciones:

1. addItem - CON optimistic update
2. updateItem - CON optimistic update
3. removeItem - SIN optimistic (mostrar loading)
4. clearCart - Invalidar caché

ESTRUCTURA:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartRepository } from '../repositories';
import type { AddCartItemDto, UpdateCartItemDto, Cart } from '../types/cart.types';

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const addItem = useMutation({
    mutationFn: (data: AddCartItemDto) => cartRepository.addItem(data),
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<Cart>(['cart']);
      // TODO: Update cache optimistically
      return { previousCart };
    },
    onError: (err, newItem, context) => {
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

  // TODO: Implementar updateItem, removeItem, clearCart

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

REQUISITOS:
- toast de 'sonner' para feedback
- Optimistic SOLO en addItem/updateItem
- Rollback en errores
- invalidateQueries después de success
```

**Archivo:** `src/cart/hooks/useCartMutations.tsx`

**Verificación:**
- [ ] 4 mutaciones implementadas
- [ ] Optimistic updates
- [ ] Toast notifications
- [ ] Error handling

---

### FASE 5: UI COMPONENTS (8-10 horas)

#### Task 7: CartIcon
**Agente:** `shadcn-ui-specialist`
**Duración:** 1 hora

**PROMPT:**
```
INSTRUCCIÓN OBLIGATORIA: Usar Context7 MCP:
1. Buscar: "shadcn/ui Button component"
2. Buscar: "WCAG 2.1 AA accessibility badges"

TAREA:
Implementa src/cart/components/CartIcon.tsx:

FUNCIONAL:
- Ícono ShoppingCart de lucide-react
- Badge con cantidad (suma de quantities)
- Mostrar "9+" si > 9 items
- onClick abre CartDrawer

UI/UX:
- shadcn/ui Button variant="ghost" size="icon"
- Badge absolute top-right
- Badge: bg-primary, text-primary-foreground, h-5 w-5
- Font: text-xs font-bold

ACCESIBILIDAD (WCAG 2.1 AA):
- aria-label: "Carrito de compras, {count} items"
- Badge con aria-hidden="true"
- Contraste adecuado

INTEGRACIÓN:
- useCart() para obtener items
- itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0)
```

**Archivo:** `src/cart/components/CartIcon.tsx`

**Verificación:**
- [ ] Badge muestra cantidad
- [ ] WCAG 2.1 AA
- [ ] aria-label descriptivo

---

#### Task 8: CartSummary
**Agente:** `shadcn-ui-specialist`
**Duración:** 1 hora

**PROMPT:**
```
TAREA:
Implementa src/cart/components/CartSummary.tsx:

ESTRUCTURA:
- Props: cart: Cart
- Muestra: Subtotal, Tax (16%), Discount (condicional), Total

DISEÑO:
- flex justify-between por línea
- Labels: text-muted-foreground
- Valores: font-medium
- Total: text-base font-bold con border-t pt-2
- Discount en text-green-600

FORMATO:
- Precios con .toFixed(2)
- Formato: $XX.XX
- Discount con -$XX.XX
```

**Archivo:** `src/cart/components/CartSummary.tsx`

**Verificación:**
- [ ] Muestra todos los valores
- [ ] Formato correcto
- [ ] Condicionales funcionan

---

#### Task 9: SizeSelectDialog
**Agente:** `shadcn-ui-specialist`
**Duración:** 1.5 horas

**PROMPT:**
```
INSTRUCCIÓN OBLIGATORIA: Usar Context7 MCP:
1. Buscar: "shadcn/ui Dialog component"

TAREA:
Implementa src/cart/components/SizeSelectDialog.tsx:

PROPS:
- open, onOpenChange, sizes, productName, onSizeSelect

ESTRUCTURA:
- Dialog de shadcn/ui
- DialogContent sm:max-w-md
- DialogHeader con "Selecciona una talla"
- DialogDescription con productName
- Grid: grid-cols-3 gap-3

BOTONES:
- variant="outline"
- h-12 text-base font-medium
- hover:bg-primary hover:text-primary-foreground
- onClick: onSizeSelect(size) + cerrar

COMPORTAMIENTO:
- Al seleccionar: callback + cerrar modal
- Modal controlado
```

**Archivo:** `src/cart/components/SizeSelectDialog.tsx`

**Verificación:**
- [ ] Dialog funciona
- [ ] Grid responsive
- [ ] Callback + cierre

---

#### Task 10: CartItem
**Agente:** `shadcn-ui-specialist`
**Duración:** 3 horas

**PROMPT:**
```
INSTRUCCIÓN OBLIGATORIA: Usar Context7 MCP:
1. Buscar: "shadcn/ui Button variants"
2. Buscar: "lucide-react icons: Minus, Plus, Trash2"

TAREA:
Implementa src/cart/components/CartItem.tsx - COMPONENTE COMPLEJO:

COMPONENTES:
1. Imagen (20x20, rounded, border)
2. Título + talla
3. Controles cantidad (- [#] +)
4. Botón eliminar (trash)
5. Precio total

LAYOUT:
- Container: flex gap-4
- Imagen: flex-shrink-0
- Detalles: flex-1 flex-col gap-2
- Footer: flex justify-between

CONTROLES CANTIDAD:
- Botones: variant="outline" size="icon" h-7 w-7
- (-) disabled si quantity <= 1
- (+) disabled si quantity >= stock
- Ambos disabled durante isPending
- Validar stock antes de incrementar

BOTÓN ELIMINAR:
- variant="ghost" size="icon" h-8 w-8
- text-muted-foreground hover:text-destructive
- aria-label="Eliminar del carrito"

INTEGRACIÓN:
- useCartMutations()
- updateItem.mutate({ itemId, data: { quantity } })
- removeItem.mutate(itemId)

VALIDACIÓN:
- Si no hay stock: toast.error('Stock insuficiente')
```

**Archivo:** `src/cart/components/CartItem.tsx`

**Verificación:**
- [ ] Controles funcionan
- [ ] Validación stock
- [ ] Botón eliminar
- [ ] Estados disabled
- [ ] Accesibilidad

---

#### Task 11: CartDrawer
**Agente:** `shadcn-ui-specialist`
**Duración:** 3 horas

**PROMPT:**
```
INSTRUCCIÓN OBLIGATORIA: Usar Context7 MCP:
1. Buscar: "shadcn/ui Sheet component"
2. Buscar: "React Router useNavigate"

TAREA:
Implementa src/cart/components/CartDrawer.tsx - COMPONENTE MÁS COMPLEJO:

ESTRUCTURA:
Sheet
├── SheetContent (derecha, w-full sm:max-w-lg)
    ├── SheetHeader (SheetTitle con ícono)
    ├── Contenido (flex-1 overflow-y-auto)
    │   ├── Loading state
    │   ├── Empty state (sin items)
    │   └── Lista CartItem (con items)
    └── SheetFooter (flex-col gap-4)
        ├── CartSummary
        └── Botones

ESTADOS:

1. LOADING:
   - "Cargando carrito..."
   - text-muted-foreground

2. EMPTY:
   - ShoppingCart h-16 w-16
   - "Tu carrito está vacío"
   - Botón "Continuar comprando"

3. CON ITEMS:
   - Lista scrollable space-y-4
   - Separator
   - CartSummary
   - "Proceder al pago" (size="lg")
   - "Seguir comprando" (variant="outline")

COMPORTAMIENTO:
- "Proceder al pago": navigate('/checkout') + cerrar
- "Seguir comprando": cerrar
- Sheet desde derecha

INTEGRACIÓN:
- useCart()
- useNavigate()
- CartItem, CartSummary, Separator

RESPONSIVE:
- Mobile: w-full
- Desktop: max-w-lg
```

**Archivo:** `src/cart/components/CartDrawer.tsx`

**Verificación:**
- [ ] 3 estados funcionan
- [ ] Lista scrollable
- [ ] Navegación funciona
- [ ] Responsive

---

### FASE 6: INTEGRACIÓN (3 horas)

#### Task 12: Integrar CartIcon en Header
**Agente:** `react-tailwind-dev`
**Duración:** 1 hora

**PROMPT:**
```
TAREA:
Integra CartIcon en src/components/custom/CustomHeader.tsx

PASOS:

1. Imports:
```typescript
import { CartIcon } from '@/cart/components/CartIcon';
import { CartDrawer } from '@/cart/components/CartDrawer';
import { useState } from 'react';
```

2. Estado:
```typescript
const [isCartOpen, setIsCartOpen] = useState(false);
```

3. En JSX (dentro div "hidden md:flex items-center gap-3"):
```typescript
{authStatus === 'authenticated' && (
  <CartIcon onOpen={() => setIsCartOpen(true)} />
)}
```

4. Drawer (después del return, dentro fragment):
```typescript
<CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
```

VERIFICACIÓN:
- CartIcon SOLO si autenticado
- Click abre drawer
```

**Archivo:** `src/components/custom/CustomHeader.tsx`

**Verificación:**
- [ ] CartIcon visible si autenticado
- [ ] Click abre drawer
- [ ] Layout no se rompe

---

#### Task 13: Integrar "Agregar al Carrito" en ProductCard
**Agente:** `react-tailwind-dev`
**Duración:** 2 horas

**PROMPT:**
```
TAREA:
Modifica src/shop/components/ProductCard.tsx

PASOS:

1. Imports:
```typescript
import { useCartMutations } from '@/cart/hooks/useCartMutations';
import { SizeSelectDialog } from '@/cart/components/SizeSelectDialog';
import { useState } from 'react';
```

2. Hooks:
```typescript
const { addItem } = useCartMutations();
const [showSizeDialog, setShowSizeDialog] = useState(false);
```

3. Handlers:
```typescript
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
```

4. Modificar botón:
   - onClick={handleAddToCart}
   - disabled={addItem.isPending}

5. Agregar Dialog (después del Card):
```typescript
<SizeSelectDialog
  open={showSizeDialog}
  onOpenChange={setShowSizeDialog}
  sizes={sizes}
  productName={name}
  onSizeSelect={handleSizeSelected}
/>
```

VERIFICACIÓN:
- Click NO navega a ProductPage
- Modal de tallas se abre
- Agregar funciona + toast
```

**Archivo:** `src/shop/components/ProductCard.tsx`

**Verificación:**
- [ ] Modal funciona
- [ ] Agregar funciona
- [ ] Toast aparece
- [ ] No navega

---

### FASE 7: TESTING (2 horas)

#### Task 14: Testing Manual
**Agente:** MANUAL
**Duración:** 2 horas

**CHECKLIST:**

**Autenticación:**
- [ ] No autenticado: NO ve CartIcon
- [ ] Autenticado: SÍ ve CartIcon
- [ ] Badge muestra "0"

**Agregar:**
- [ ] Click abre modal de tallas
- [ ] Seleccionar agrega + toast
- [ ] Badge se actualiza
- [ ] Modal se cierra

**CartDrawer:**
- [ ] Click en icon abre drawer
- [ ] Muestra productos
- [ ] Imagen, título, talla, cantidad ok
- [ ] Precio correcto

**Controles:**
- [ ] Botón (-) disminuye
- [ ] Botón (+) aumenta
- [ ] (-) disabled en cantidad = 1
- [ ] (+) disabled si alcanza stock
- [ ] Toast error si excede stock

**Eliminar:**
- [ ] Botón trash elimina
- [ ] Toast confirmación
- [ ] UI actualizada

**Summary:**
- [ ] Subtotal correcto
- [ ] Tax correcto (16%)
- [ ] Total correcto
- [ ] Formato $XX.XX

**Responsive:**
- [ ] Mobile: Drawer fullscreen
- [ ] Desktop: max-width

**Edge Cases:**
- [ ] Empty state
- [ ] Loading state
- [ ] Error handling

---

#### Task 15: Code Review
**Agente:** `clean-architecture-code-reviewer`
**Duración:** 30 min

**PROMPT:**
```
Revisa TODA la implementación del carrito:

ARQUITECTURA:
- [ ] Repository Pattern correcto
- [ ] Service con métodos puros
- [ ] Hooks con React Query
- [ ] Separación de responsabilidades

CÓDIGO:
- [ ] Sin errores TypeScript
- [ ] Tipos correctos
- [ ] Imports organizados
- [ ] Nombres descriptivos

REACT QUERY:
- [ ] useQuery correcto
- [ ] useMutation correcto
- [ ] Optimistic updates apropiados
- [ ] Invalidación correcta

UI/UX:
- [ ] shadcn/ui correcto
- [ ] Accesibilidad
- [ ] Loading states
- [ ] Error handling

ARCHIVOS:
- src/cart/types/cart.types.ts
- src/cart/repositories/*
- src/cart/services/*
- src/cart/hooks/*
- src/cart/components/*
```

**Verificación:**
- [ ] Sin errores arquitectura
- [ ] Clean Architecture
- [ ] Best practices React Query

---

#### Task 16: Accessibility Audit
**Agente:** `accessibility-auditor`
**Duración:** 30 min

**PROMPT:**
```
Audita accesibilidad de componentes:

COMPONENTES:
1. CartIcon.tsx
2. CartDrawer.tsx
3. CartItem.tsx
4. CartSummary.tsx
5. SizeSelectDialog.tsx

VERIFICAR:
- WCAG 2.1 AA compliance
- aria-labels
- Contraste colores
- Focus management
- Keyboard navigation
- Screen reader
- Estados disabled

REPORTAR:
- Issues encontrados
- Severidad
- Soluciones
```

**Verificación:**
- [ ] WCAG 2.1 AA
- [ ] aria-labels
- [ ] Keyboard nav

---

## RESUMEN DE AGENTES

| Agente | Tasks | Horas |
|--------|-------|-------|
| `react-tailwind-dev` | 2, 5, 6, 12, 13 | 7h |
| `shadcn-ui-specialist` | 7, 8, 9, 10, 11 | 9.5h |
| `clean-architecture-code-reviewer` | 3, 4, 15 | 4h |
| `accessibility-auditor` | 16 | 0.5h |
| MANUAL | 1, 14 | 2.25h |

**Total:** 23.25 horas

---

## CHECKLIST GENERAL

**Setup:**
- [ ] Estructura creada
- [ ] Tipos definidos

**Data Layer:**
- [ ] Repository implementado
- [ ] Service implementado

**Hooks:**
- [ ] useCart funcionando
- [ ] useCartMutations funcionando

**UI:**
- [ ] CartIcon
- [ ] CartSummary
- [ ] SizeSelectDialog
- [ ] CartItem
- [ ] CartDrawer

**Integración:**
- [ ] Header integrado
- [ ] ProductCard integrado

**Testing:**
- [ ] Testing manual 8/8
- [ ] Code review aprobado
- [ ] Accessibility audit aprobado

**Build:**
- [ ] npm run build exitoso
- [ ] Sin errores TypeScript
- [ ] Sin warnings

---

## PRÓXIMOS PASOS

Después del MVP:
1. Página dedicada `/cart`
2. Responsive móvil mejorado
3. Animaciones
4. Features avanzados (ver CART_STRATEGIC_ANALYSIS.md)

---

**Documento creado:** 2025-11-01
**Versión:** 1.0
**Tiempo total:** 25-30 horas
