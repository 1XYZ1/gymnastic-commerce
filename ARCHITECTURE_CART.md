# ANÁLISIS ARQUITECTÓNICO - CART FEATURE

> Análisis completo de la arquitectura actual para implementar el feature de carrito de forma consistente.

---

## 1. ESTRUCTURA DE FEATURES (Feature-First Architecture)

La aplicación organiza el código por **features independientes**:

```
src/
├── auth/          # Autenticación (login/registro)
├── shop/          # Tienda pública (MEJOR MODELO PARA CART)
├── admin/         # Panel administrativo
├── shared/        # Tipos compartidos entre features
├── components/    # UI components globales (shadcn/ui)
├── config/        # Configuración global
├── api/           # Cliente API (Axios)
└── lib/           # Utilidades
```

### Estructura interna de cada feature:
```
src/[feature]/
├── components/    # Componentes específicos del feature
├── hooks/         # Custom hooks (useProducts, useCart, etc.)
├── pages/         # Páginas/rutas
├── repositories/  # Data access layer (implementa interfaces)
├── services/      # Lógica de negocio
├── types/         # Tipos específicos del dominio
├── store/         # Zustand (SOLO si es necesario, auth lo usa)
├── layouts/       # Layouts del feature
├── config/        # Configuración local
└── mappers/       # Transformadores DTO → Domain
```

---

## 2. PATRONES ARQUITECTÓNICOS

### Repository Pattern (Data Access Layer)

**Paso 1: Definir interfaz** (`repositories/IAuthRepository.ts`)
```typescript
export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
  checkStatus(): Promise<AuthResponse>;
}
```

**Paso 2: Implementación** (`repositories/AuthApiRepository.ts`)
```typescript
export class AuthApiRepository implements IAuthRepository {
  constructor(private api: AxiosInstance) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await this.api.post('/auth/login', { email, password });
    return data;
  }
}
```

**Paso 3: Inyección** (`repositories/index.ts`)
```typescript
export const authRepository = new AuthApiRepository(gymApi);
```

**Ventajas:**
- Desacoplamiento entre servicios e implementación HTTP
- Fácil testing con mocks
- Cambio de provider sin tocar lógica de negocio

### Service Pattern (Business Logic)

Los servicios **coordinan** repositories + lógica de negocio:

```typescript
export class AuthService {
  constructor(
    private repository: IAuthRepository,
    private tokenStorage: TokenStorageService
  ) {}

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await this.repository.login(email, password);
      this.tokenStorage.save(response.token);
      return { success: true, user: response.user };
    } catch (error) {
      this.tokenStorage.remove();
      return { success: false, error: getUserFriendlyMessage(error) };
    }
  }
}
```

**Responsabilidades del Service:**
- Coordina múltiples repositories
- Maneja errores y los transforma a user-friendly
- Ejecuta validaciones de negocio
- NUNCA renderiza UI ni maneja estado React

---

## 3. MANEJO DE ESTADO

### ⚠️ IMPORTANTE: Cuándo usar cada herramienta

| Caso de uso | Herramienta | Ejemplo |
|-------------|-------------|---------|
| **Estado global sincrónico** | Zustand | Auth (user, token) |
| **Datos remotos con caché** | React Query | Productos, **Carrito** |
| **Estado local de componente** | useState | Modales, forms |
| **Parámetros de URL** | useSearchParams | Filtros (shop) |

### Zustand (SOLO 1 store: auth)

**Ubicación:** `src/auth/store/auth.store.ts`

```typescript
type AuthState = {
  user: User | null;
  token: string | null;
  authStatus: 'authenticated' | 'not-authenticated' | 'checking';
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  // Getters
  isAdmin: () => boolean;
};
```

**Principio:** El store **solo coordina**, delega toda la lógica a `authService`.

### React Query (Datos remotos - USA ESTO PARA CART)

**Ejemplo del feature `shop`:**

```typescript
// hooks/useProducts.tsx
export const useProducts = (filters: ProductFilter) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productRepository.getProducts(filters),
  });
};
```

**Por qué React Query para el carrito:**
- El carrito es **dato remoto** (persistido en servidor)
- Maneja caché automático
- Invalidación y revalidación automática
- Optimistic updates
- Sincronización cliente ↔ servidor

---

## 4. TIPOS E INTERFACES

### Tipos Compartidos (`src/shared/types/`)

```
shared/types/
├── product.types.ts           # Product, Size, Gender
├── user.types.ts              # User
├── api-responses.types.ts     # ProductsResponse
└── index.ts                   # Re-exports
```

**Importar:**
```typescript
import type { Product, User, Size } from '@/shared/types'
```

### Tipos Específicos de Feature

Cada feature tiene su carpeta `types/`:
- `auth/types/auth.types.ts` - AuthResponse, LoginCredentials
- `shop/types/product-filter.types.ts` - ProductFilter, PriceRange
- **`cart/types/cart.types.ts`** - Cart, CartItem (por crear)

---

## 5. API CLIENT (Axios)

**Ubicación:** `src/api/gymApi.ts`

```typescript
const gymApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor: agrega token automáticamente
gymApi.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Todos los repositories usan esta instancia de Axios.

---

## 6. ROUTING (React Router v6)

**Archivo:** `src/app.router.tsx`

```typescript
export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <ShopLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'product/:idSlug', element: <ProductPage /> },
    ],
  },
  {
    path: '/auth',
    element: <NotAuthenticatedRoute><AuthLayout /></NotAuthenticatedRoute>,
    children: [
      { path: 'login', element: <LoginPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { path: 'products', element: <AdminProductsPage /> },
    ],
  },
]);
```

**Protección de rutas:** Wrapper components
- `NotAuthenticatedRoute` - Redirige si ya está autenticado
- `AdminRoute` - Solo admin autenticados

---

## 7. FLUJO DE DATOS (Ejemplo: Shop Feature)

```
URL (?page=2&sizes=M,L)
    ↓
useProductFilters() [Parsea URL]
    ↓
useProducts(filters) [React Query]
    ↓
productRepository.getProducts(filters)
    ↓
gymApi.get('/products', { params })
    ↓
ProductApiRepository.mapper.toDomainList()
    ↓
Component recibe: { data, isLoading, error }
```

---

## 8. RECOMENDACIONES PARA CART FEATURE

### Estructura Propuesta

```
src/cart/
├── components/
│   ├── CartIcon.tsx          # Ícono con badge (cantidad)
│   ├── CartDrawer.tsx        # Drawer lateral (shadcn Sheet)
│   ├── CartItem.tsx          # Item individual
│   └── CartSummary.tsx       # Resumen (subtotal, total)
├── hooks/
│   ├── useCart.tsx           # READ (React Query)
│   └── useCartMutations.tsx  # WRITE (add/update/remove)
├── repositories/
│   ├── ICartRepository.ts
│   └── CartApiRepository.ts
├── services/
│   ├── CartService.ts        # Cálculos (subtotal, total, tax)
│   └── CartErrorService.ts
├── types/
│   └── cart.types.ts
└── config/
    └── cart.config.ts
```

### Tipos del Carrito

```typescript
// cart/types/cart.types.ts
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: Size;
  priceAtTime: number;  // Precio en momento de agregar
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}
```

### Hooks con React Query

```typescript
// hooks/useCart.tsx (READ)
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartRepository.getCart(),
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

// hooks/useCartMutations.tsx (WRITE)
export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const addItem = useMutation({
    mutationFn: (data: AddCartItemDto) => cartRepository.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Producto agregado al carrito');
    },
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => cartRepository.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return { addItem, updateItem, removeItem, clearCart };
};
```

### Uso en Componentes

```typescript
// En ProductCard.tsx
const { addItem } = useCartMutations();

const handleAddToCart = () => {
  addItem.mutate({
    productId: product.id,
    quantity: 1,
    size: selectedSize
  });
};

// En Header.tsx
const { data: cart, isLoading } = useCart();

<CartIcon itemCount={cart?.items.length || 0} />
```

---

## 9. ARCHIVOS DE REFERENCIA CLAVE

### Para Estructura General:
- `src/shop/` - **MEJOR MODELO** (usa React Query, no Zustand)
- `src/auth/` - Ejemplo completo de feature con Zustand

### Para Repository Pattern:
- `src/auth/repositories/IAuthRepository.ts`
- `src/auth/repositories/AuthApiRepository.ts`

### Para Service Pattern:
- `src/auth/services/AuthService.ts`
- `src/shop/services/ProductFilterService.ts`

### Para React Query:
- `src/shop/hooks/useProducts.tsx` ⭐
- `src/shop/hooks/useProductFilters.tsx`

### Para Tipos:
- `src/shared/types/index.ts`
- `src/auth/types/auth.types.ts`

---

## 10. CONVENCIONES Y PRINCIPIOS

| Aspecto | Patrón | Ubicación |
|---------|--------|-----------|
| **Estructura** | Feature-first | `src/[feature]/` |
| **Estado sincrónico** | Zustand (raro) | `[feature]/store/` |
| **Estado asíncrono** | React Query ⭐ | Hooks |
| **Data Access** | Repository | `[feature]/repositories/` |
| **Lógica** | Service classes | `[feature]/services/` |
| **Tipos globales** | Interfaces | `shared/types/` |
| **Tipos locales** | Interfaces | `[feature]/types/` |
| **UI base** | shadcn/ui | `components/ui/` |
| **UI custom** | Components | `components/custom/` |
| **Routing** | React Router v6 | `app.router.tsx` |
| **API** | Axios | `api/gymApi.ts` |

### Principios Clave:
1. **DIP** - Dependency Inversion (interfaces para desacoplamiento)
2. **SRP** - Single Responsibility (cada clase una responsabilidad)
3. **Repository** - Abstrae acceso a datos
4. **Service** - Lógica de negocio pura
5. **React Query** - Para datos remotos (carrito, productos)
6. **Zustand** - Solo para estado sincrónico global (auth)

---

**Fecha de análisis:** 2025-11-01
**Próximo paso:** Análisis estratégico con `ecommerce-feature-strategist`
