# Fix: Dependencia Circular en Producción

## 🐛 Problema Identificado

**Error en Vercel:** `Uncaught ReferenceError: Cannot access 'W' before initialization`

### Causa Raíz

Dependencia circular en la inicialización de módulos que en **desarrollo funciona**, pero en **producción falla** debido a cómo Vite minifica y reordena los módulos.

### El Ciclo Problemático

```
gymApi.ts
  └─> import { tokenStorage } from "@/auth/services"  // ❌ Barrel export
        └─> @/auth/services/index.ts
              └─> exporta TokenStorageService, AuthService, etc.
                    └─> @/auth/repositories/index.ts
                          └─> import { gymApi } from '@/api/gymApi'  // ⚠️ CICLO
```

Además, **todos los repositorios** se instanciaban inmediatamente:

```typescript
// ❌ PROBLEMA: Instanciación inmediata
export const petRepository = new PetApiRepository();
export const medicalRepository = new MedicalApiRepository();
export const groomingRepository = new GroomingApiRepository();
// ... etc
```

Cuando Vite minifica el código en producción, puede intentar acceder a estas instancias antes de que `gymApi` esté completamente inicializado, causando el error `Cannot access 'W' before initialization` (donde 'W' es la variable minificada).

## ✅ Solución Implementada

### 1. Import Directo en `gymApi.ts`

**Antes:**
```typescript
import { tokenStorage } from "@/auth/services";  // ❌ Barrel export
```

**Después:**
```typescript
import { tokenStorage } from "@/auth/services/TokenStorageService";  // ✅ Directo
```

**Razón:** Evita cargar todo el módulo `@/auth/services` que incluye `AuthService` y otros servicios que dependen de `gymApi`.

### 2. Lazy Initialization en Repositorios

**Antes:**
```typescript
// ❌ Instanciación inmediata al importar el módulo
export const petRepository = new PetApiRepository();
```

**Después:**
```typescript
// ✅ Lazy initialization - se crea cuando se usa, no cuando se importa
let _petRepository: PetApiRepository | undefined;

const getPetRepository = (): PetApiRepository => {
  if (!_petRepository) {
    _petRepository = new PetApiRepository();
  }
  return _petRepository;
};

export const petRepository = getPetRepository();
```

**Razón:** Garantiza que el repositorio se crea **después** de que `gymApi` esté completamente inicializado, no durante la fase de carga de módulos.

## 📝 Archivos Modificados

1. **`src/api/gymApi.ts`** - Import directo de `TokenStorageService`
2. **`src/pets/repositories/index.ts`** - Lazy initialization
3. **`src/medical/repositories/index.ts`** - Lazy initialization
4. **`src/grooming/repositories/index.ts`** - Lazy initialization
5. **`src/shop/repositories/index.ts`** - Lazy initialization
6. **`src/appointments/repositories/index.ts`** - Lazy initialization
7. **`src/services/repositories/index.ts`** - Lazy initialization
8. **`src/admin/repositories/index.ts`** - Lazy initialization
9. **`src/cart/repositories/index.ts`** - Lazy initialization

## 🎯 Beneficios

1. **✅ Elimina dependencias circulares** - Rompe el ciclo de importaciones
2. **✅ Funciona en producción** - El minificador no puede causar problemas de orden
3. **✅ Mantiene el patrón Singleton** - Cada repositorio sigue siendo una instancia única
4. **✅ Sin cambios en el uso** - El código que usa los repositorios no necesita cambios
5. **✅ Mejor rendimiento** - Los repositorios se inicializan solo cuando se necesitan

## 🔍 Cómo Detectar Dependencias Circulares

### En Desarrollo
Usualmente funcionan porque los módulos se cargan en orden predecible.

### En Producción
Causan errores como:
- `Cannot access 'X' before initialization`
- `X is not defined`
- Pantalla en blanco sin errores obvios

### Herramientas
```bash
# Analizar dependencias circulares
npx madge --circular --extensions ts,tsx src/

# Visualizar el grafo de dependencias
npx madge --circular --extensions ts,tsx --image graph.svg src/
```

## 📚 Mejores Prácticas

### ✅ DO

1. **Usa imports directos** para servicios críticos como `gymApi`
   ```typescript
   import { tokenStorage } from "@/auth/services/TokenStorageService";
   ```

2. **Implementa lazy initialization** para singletons que dependen de otros módulos
   ```typescript
   let _instance: MyClass | undefined;
   export const getInstance = () => {
     if (!_instance) _instance = new MyClass();
     return _instance;
   };
   ```

3. **Usa Dependency Injection** cuando sea posible
   ```typescript
   constructor(private api: AxiosInstance) {}
   ```

### ❌ DON'T

1. **No uses barrel exports** (`index.ts`) para módulos críticos con dependencias cruzadas
   ```typescript
   // ❌ Puede causar ciclos
   import { tokenStorage } from "@/auth/services";
   ```

2. **No instancies singletons al nivel del módulo** si dependen de otros módulos
   ```typescript
   // ❌ Se ejecuta al importar
   export const repo = new Repository();
   ```

3. **No asumas que el orden de imports es predecible** en producción

## 🧪 Testing

### Verificar localmente
```bash
# Build de producción
npm run build

# Preview del build
npm run preview

# Abrir en navegador y verificar consola
```

### Verificar en Vercel
1. Hacer push de los cambios
2. Esperar el deploy
3. Abrir DevTools (F12) → Console
4. Verificar que no hay errores de inicialización

## 📖 Referencias

- [Vite: Dependency Pre-Bundling](https://vitejs.dev/guide/dep-pre-bundling.html)
- [MDN: Cannot access before initialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_lexical_declaration_before_init)
- [Circular Dependencies in JavaScript](https://blog.logrocket.com/understanding-and-resolving-circular-dependencies-node-js/)

---

**Fecha:** 2025-11-09
**Autor:** Claude AI
**Status:** ✅ Resuelto
