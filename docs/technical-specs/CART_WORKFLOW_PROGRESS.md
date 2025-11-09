# WORKFLOW DE IMPLEMENTACIÓN DEL CARRITO - PROGRESO

> Documento de seguimiento del workflow completo para crear el feature de carrito

**Fecha inicio:** 2025-11-01
**Estado actual:** Paso 3 completado, listo para implementación (Paso 4)

---

## WORKFLOW DEFINIDO

### Paso 1: ✅ COMPLETADO - Exploración de la arquitectura existente
**Estado:** Completado
**Resultado:** Análisis exhaustivo documentado en `ARCHITECTURE_CART.md`

**Hallazgos clave:**
- Arquitectura Feature-First (cada feature en `src/[feature]/`)
- Repository Pattern para data access
- Service Pattern para business logic
- React Query para datos remotos (USAR PARA CARRITO)
- Zustand SOLO para auth (NO usar para carrito)
- Shop feature es el MEJOR MODELO a seguir

**Archivos de referencia identificados:**
- `src/shop/hooks/useProducts.tsx` - Ejemplo de React Query
- `src/auth/repositories/` - Ejemplo de Repository Pattern
- `src/auth/services/AuthService.ts` - Ejemplo de Service Pattern

---

### Paso 2: ✅ COMPLETADO - Análisis estratégico del feature
**Estado:** Completado
**Agente usado:** `ecommerce-feature-strategist`

**Resultado:** Plan estratégico completo con:

#### Funcionalidades CORE del MVP (10 items):
1. Estructura base del feature (3 SP / 2-3h)
2. Tipos e interfaces TypeScript (2 SP / 1h)
3. Repository Pattern (5 SP / 3-4h)
4. Hooks con React Query (5 SP / 3-4h)
5. CartService (3 SP / 2h)
6. CartIcon con badge (2 SP / 1-2h)
7. CartDrawer (5 SP / 4-5h)
8. CartItem component (5 SP / 3-4h)
9. CartSummary component (2 SP / 1-2h)
10. Integrar en ProductCard (5 SP / 3-4h)

**Total MVP:** 37 Story Points / 25-30 horas

#### Decisiones arquitectónicas tomadas:
- ✅ **UI:** Drawer (MVP) + Página dedicada (Post-MVP)
- ✅ **Persistencia:** Servidor (MVP) + localStorage fallback (P3)
- ✅ **Estado:** React Query (NO Zustand)
- ✅ **Validación:** Cliente preventiva + Servidor autoritativa
- ✅ **UX:** Optimistic updates para operaciones seguras

#### Endpoints API necesarios (Backend NestJS):
```
GET    /cart                   # Obtener carrito
POST   /cart/items             # Agregar item
PATCH  /cart/items/:itemId     # Actualizar cantidad/talla
DELETE /cart/items/:itemId     # Eliminar item
DELETE /cart                   # Vaciar carrito
POST   /cart/merge             # Merge localStorage → servidor (P3)
POST   /cart/apply-coupon      # Aplicar cupón (P3)
GET    /cart/recommended-products # Recomendaciones (P3)
```

#### Plan de Sprints:
- **Sprint 1 (MVP):** 37 SP / 1 semana
- **Sprint 2 (UX):** 16 SP / 3-4 días
- **Sprint 3 (Avanzado):** 19 SP / 1 semana

**Total estimado:** 72 SP / ~2 semanas

---

### Paso 3: ✅ COMPLETADO - Plan detallado de implementación
**Estado:** Completado
**Documentos generados:**
- `FRONTEND_CART_PLAN.md` - Plan completo de frontend con agentes y Context7
- `BACKEND_CART_MINIMAL.md` - Plan mínimo para backend NestJS

**Resultado:**

#### Frontend Plan (16 tasks organizadas en 7 fases):
1. **FASE 1: Setup y Tipos** (1-2h)
   - Task 1: Crear estructura de carpetas (MANUAL)
   - Task 2: Definir tipos TypeScript (react-tailwind-dev)

2. **FASE 2: Data Access** (2h)
   - Task 3: Repository Pattern (clean-architecture-code-reviewer)

3. **FASE 3: Business Logic** (1.5h)
   - Task 4: CartService (clean-architecture-code-reviewer)

4. **FASE 4: React Query Hooks** (3h)
   - Task 5: useCart - READ (react-tailwind-dev)
   - Task 6: useCartMutations - WRITE (react-tailwind-dev)

5. **FASE 5: UI Components** (8-10h)
   - Task 7: CartIcon (shadcn-ui-specialist)
   - Task 8: CartSummary (shadcn-ui-specialist)
   - Task 9: SizeSelectDialog (shadcn-ui-specialist)
   - Task 10: CartItem (shadcn-ui-specialist)
   - Task 11: CartDrawer (shadcn-ui-specialist)

6. **FASE 6: Integración** (3h)
   - Task 12: Integrar CartIcon en Header (react-tailwind-dev)
   - Task 13: Integrar "Agregar al Carrito" en ProductCard (react-tailwind-dev)

7. **FASE 7: Testing** (2h)
   - Task 14: Testing Manual (MANUAL)
   - Task 15: Code Review (clean-architecture-code-reviewer)
   - Task 16: Accessibility Audit (accessibility-auditor)

**Total Frontend:** 23-25 horas

#### Backend Plan (Checklist mínimo):
- Generar módulo con NestJS CLI
- Crear entidades Cart y CartItem
- Implementar DTOs básicos
- Controller con 5 endpoints
- Service con lógica básica
- SQL para crear tablas

**Total Backend:** 2-3 horas

#### Instrucciones de Context7:
Cada agente DEBE consultar Context7 MCP ANTES de implementar:
- `@tanstack/react-query` - Para hooks (Tasks 5, 6)
- `shadcn/ui` - Para componentes UI (Tasks 7-11)
- `React Router` - Para navegación (Task 11)
- `TypeScript` best practices - Para tipos (Tasks 2, 3)

**Próxima acción:** Coordinar con backend para implementar endpoints básicos, luego comenzar Fase 1 del frontend

---

### Paso 4: ⏳ PENDIENTE - Implementar estructura base del carrito
**Estado:** No iniciado
**Dependencias:** Completar Paso 3

---

## TODO LIST ACTUAL

- [x] Explorar arquitectura existente de features
- [x] Analizar estratégicamente funcionalidades del carrito
- [x] Crear plan detallado de implementación
- [ ] Coordinar con backend para implementar endpoints
- [ ] Implementar estructura base del carrito (Paso 4)

---

## ESTRUCTURA PROPUESTA DEL CARRITO

```
src/cart/
├── components/
│   ├── CartIcon.tsx          # Ícono con badge (cantidad)
│   ├── CartDrawer.tsx        # Drawer lateral (shadcn Sheet)
│   ├── CartItem.tsx          # Item individual
│   ├── CartSummary.tsx       # Resumen (subtotal, total)
│   └── SizeSelectDialog.tsx  # Modal selección de talla
├── hooks/
│   ├── useCart.tsx           # READ (React Query)
│   └── useCartMutations.tsx  # WRITE (add/update/remove)
├── repositories/
│   ├── ICartRepository.ts    # Interface
│   └── CartApiRepository.ts  # Implementación HTTP
├── services/
│   ├── CartService.ts        # Cálculos (subtotal, total, tax)
│   └── CartErrorService.ts   # Manejo de errores
├── types/
│   └── cart.types.ts         # CartItem, Cart, DTOs
└── config/
    └── cart.config.ts        # Configuración (tax rate, etc.)
```

---

## TIPOS DEFINIDOS

```typescript
// cart/types/cart.types.ts
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: Size;
  priceAtTime: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  updatedAt: Date;
}

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

---

## INTEGRACIONES NECESARIAS

### En `CustomHeader.tsx` (línea 100):
```typescript
import { CartIcon } from '@/cart/components/CartIcon';
import { CartDrawer } from '@/cart/components/CartDrawer';
import { useState } from 'react';

const [isCartOpen, setIsCartOpen] = useState(false);

// En el JSX:
{authStatus === 'authenticated' && (
  <CartIcon onOpen={() => setIsCartOpen(true)} />
)}

<CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
```

### En `ProductCard.tsx` (línea 36-40):
```typescript
import { useCartMutations } from '@/cart/hooks/useCartMutations';
import { SizeSelectDialog } from '@/cart/components/SizeSelectDialog';

const { addItem } = useCartMutations();
const [showSizeDialog, setShowSizeDialog] = useState(false);

// Modificar botón "Agregar al carrito"
const handleAddToCart = (e: React.MouseEvent) => {
  e.stopPropagation();
  setShowSizeDialog(true);
};
```

---

## DESAFÍOS TÉCNICOS IDENTIFICADOS

### 1. Sincronización Cliente ↔ Servidor
**Solución:** React Query con optimistic updates
- `staleTime: 5 minutos`
- Invalidación tras mutaciones
- Rollback automático en errores

### 2. Validación de Stock
**Solución:** Doble validación
- Cliente: Preventiva (UX)
- Servidor: Autoritativa (seguridad)

### 3. Cambios de Precio
**Solución:** Alert visual
- Backend devuelve `priceAtTime` vs `currentPrice`
- UI muestra warning si difieren

### 4. Tallas Requeridas
**Solución:** Validación estricta
- Modal obligatorio en ProductCard
- Backend valida con DTO
- No permitir agregar sin talla

---

## MÉTRICAS DE ÉXITO

### Técnicas:
- Tiempo de carga del carrito < 200ms
- Tasa de error en mutaciones < 1%
- Coverage de tests > 80%

### Negocio:
- Tasa de agregar al carrito > 15%
- Tasa de abandono < 70%
- Valor promedio > $80
- Conversión carrito → compra > 30%

---

## PRÓXIMOS PASOS INMEDIATOS

1. **Ejecutar `/clear`** para cargar nuevo MCP
2. **Continuar Paso 3:** Plan detallado de implementación usando Context7
3. **Coordinar con backend:** Endpoints necesarios
4. **Iniciar Sprint 1:** Implementación del MVP

---

## COMANDOS PARA RETOMAR

Después de `/clear`, usar:

```
Hola, quiero continuar con el Paso 3 del workflow de implementación del carrito.

Contexto:
- Ya completé Paso 1 (exploración arquitectura) → Ver ARCHITECTURE_CART.md
- Ya completé Paso 2 (análisis estratégico) → Ver este archivo
- Necesito crear el plan detallado de implementación (Paso 3)
- Usa el MCP de Context7 para buscar mejores prácticas actualizadas de:
  * React Query v5 (Tanstack Query)
  * shadcn/ui Sheet component
  * React Router v7
  * Repository Pattern en TypeScript

Por favor, crea el plan paso a paso con código de ejemplo siguiendo las mejores prácticas 2025.
```

---

**Última actualización:** 2025-11-01 13:45
**Documento mantenido por:** Claude Code (workflow automático)
