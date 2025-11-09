# Patrón de Validación con Zod

## 🎯 Objetivo

Eliminar todos los tipos `any` usando validación runtime con Zod. Esto proporciona:
- ✅ Seguridad de tipos completa
- ✅ Validación en runtime (detecta datos corruptos del backend)
- ✅ Tipos inferidos automáticamente
- ✅ Mejor documentación del contrato API
- ✅ Autocomplete mejorado en IDE

## 📦 Dependencias

```bash
npm install zod
```

## 🏗️ Estructura del Patrón

Para cada módulo, sigue este patrón de 3 archivos:

```
src/[modulo]/
├── schemas/
│   └── [modulo].schemas.ts    (NUEVO - Schemas Zod)
├── repositories/
│   └── [Modulo]ApiRepository.ts (ACTUALIZAR - Usar schemas)
└── mappers/
    └── [Modulo]Mapper.ts        (ACTUALIZAR - Tipos inferidos)
```

---

## 📝 Paso 1: Crear Schemas Zod

**Archivo:** `src/[modulo]/schemas/[modulo].schemas.ts`

### Ejemplo: Appointments

```typescript
import { z } from 'zod';

/**
 * Schema para el status (enum)
 */
export const AppointmentStatusSchema = z.enum([
  'pending',
  'confirmed',
  'completed',
  'cancelled',
]);

/**
 * Schema para objetos anidados (nested)
 */
export const ServiceNestedSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['medical', 'grooming']),
  description: z.string(),
  price: z.number(),
  durationMinutes: z.number(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const UserNestedSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
});

export const PetNestedSchema = z.object({
  id: z.string(),
  name: z.string(),
  breed: z.string().optional(),
  species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other']).optional(),
}).optional(); // .optional() si puede venir null/undefined

/**
 * Schema principal del modelo
 */
export const AppointmentApiSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO 8601
  status: AppointmentStatusSchema,
  notes: z.string().optional(),
  petId: z.string(),
  pet: PetNestedSchema,
  service: ServiceNestedSchema,
  customer: UserNestedSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Schema para respuesta paginada
 */
export const AppointmentsResponseSchema = z.object({
  data: z.array(AppointmentApiSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

/**
 * Tipos inferidos automáticamente
 * ¡NO necesitas escribir interfaces manualmente!
 */
export type AppointmentApi = z.infer<typeof AppointmentApiSchema>;
export type AppointmentsResponseApi = z.infer<typeof AppointmentsResponseSchema>;
export type ServiceNestedApi = z.infer<typeof ServiceNestedSchema>;
export type UserNestedApi = z.infer<typeof UserNestedSchema>;
```

### 🔑 Reglas para Schemas

| Tipo Backend | Schema Zod | Ejemplo |
|--------------|------------|---------|
| `string` | `z.string()` | `name: z.string()` |
| `string?` (opcional) | `z.string().optional()` | `breed: z.string().optional()` |
| `number` | `z.number()` | `price: z.number()` |
| `boolean` | `z.boolean()` | `isActive: z.boolean()` |
| `Date (ISO string)` | `z.string()` | `createdAt: z.string()` |
| `enum` | `z.enum([...])` | `status: z.enum(['pending', 'confirmed'])` |
| `object` | `z.object({...})` | `service: z.object({ id: z.string() })` |
| `array` | `z.array(...)` | `data: z.array(AppointmentApiSchema)` |
| `nullable` | `.nullable()` | `notes: z.string().nullable()` |
| `optional` | `.optional()` | `pet: PetNestedSchema.optional()` |

---

## 🔧 Paso 2: Actualizar Repository

**Archivo:** `src/[modulo]/repositories/[Modulo]ApiRepository.ts`

### Antes (con `any`)
```typescript
async getAppointments(filter: AppointmentFilter): Promise<AppointmentsResponse> {
  const { data } = await this.api.get<any>('/appointments', { params });
  return this.mapper.toDomainList(data);
}
```

### Después (con Zod)
```typescript
import { AppointmentApiSchema, AppointmentsResponseSchema } from '../schemas/appointment.schemas';

async getAppointments(filter: AppointmentFilter): Promise<AppointmentsResponse> {
  const { data } = await this.api.get('/appointments', { params }); // ❌ Quita <any>

  // ✅ Validar con Zod (lanza error si datos inválidos)
  const validated = AppointmentsResponseSchema.parse(data);

  return this.mapper.toDomainList(validated);
}

async getAppointmentById(id: string): Promise<Appointment> {
  const { data } = await this.api.get(`/appointments/${id}`);

  // ✅ Validar con Zod
  const validated = AppointmentApiSchema.parse(data);

  return this.mapper.toDomain(validated);
}

async createAppointment(dto: CreateAppointmentDTO): Promise<Appointment> {
  const { data } = await this.api.post('/appointments', dto);

  // ✅ Validar con Zod
  const validated = AppointmentApiSchema.parse(data);

  return this.mapper.toDomain(validated);
}
```

### 🎯 Patrón a seguir

1. **Quitar** `<any>` de `api.get<any>()`, `api.post<any>()`, etc.
2. **Agregar** validación: `const validated = Schema.parse(data);`
3. **Pasar** datos validados al mapper

---

## 🗺️ Paso 3: Actualizar Mapper

**Archivo:** `src/[modulo]/mappers/[Modulo]Mapper.ts`

### Antes (con `any`)
```typescript
export class AppointmentMapper {
  static toDomain(apiAppointment: any): Appointment {
    return {
      id: apiAppointment.id,
      // ...
    };
  }

  static toDomainList(apiResponse: any): AppointmentsResponse {
    return {
      data: apiResponse.data.map((item: any) => this.toDomain(item)),
      // ...
    };
  }
}
```

### Después (con tipos inferidos)
```typescript
import type { AppointmentApi, AppointmentsResponseApi } from '../schemas/appointment.schemas';

export class AppointmentMapper {
  // ✅ Usa el tipo inferido de Zod
  static toDomain(apiAppointment: AppointmentApi): Appointment {
    return {
      id: apiAppointment.id,
      // ...
    };
  }

  // ✅ Usa el tipo inferido de Zod
  static toDomainList(apiResponse: AppointmentsResponseApi): AppointmentsResponse {
    return {
      data: apiResponse.data.map((item) => this.toDomain(item)),
      // ...
    };
  }
}
```

### 🎯 Cambios clave

1. **Importar** tipos inferidos: `import type { AppointmentApi } from '../schemas'`
2. **Reemplazar** `any` por el tipo inferido
3. **Eliminar** `as any` o type assertions innecesarias

---

## 📊 Ejemplo Completo: Módulo Pets

### 1. Crear `src/pets/schemas/pet.schemas.ts`

```typescript
import { z } from 'zod';

export const PetSpeciesSchema = z.enum([
  'dog',
  'cat',
  'bird',
  'rabbit',
  'hamster',
  'fish',
  'reptile',
  'other',
]);

export const PetGenderSchema = z.enum(['male', 'female']);

export const PetTemperamentSchema = z.enum([
  'friendly',
  'aggressive',
  'shy',
  'playful',
  'calm',
  'energetic',
]);

export const PetApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: PetSpeciesSchema,
  breed: z.string().optional(),
  birthDate: z.string(), // ISO 8601
  gender: PetGenderSchema,
  color: z.string().optional(),
  weight: z.number().optional(),
  microchipNumber: z.string().optional(),
  profilePhoto: z.string().optional(),
  temperament: PetTemperamentSchema,
  behaviorNotes: z.array(z.string()),
  generalNotes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  owner: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string().email(),
  }).optional(),
});

export const PetsResponseSchema = z.object({
  data: z.array(PetApiSchema),
  count: z.number(),
  pages: z.number(),
});

// Tipos inferidos
export type PetApi = z.infer<typeof PetApiSchema>;
export type PetsResponseApi = z.infer<typeof PetsResponseSchema>;
```

### 2. Actualizar `src/pets/repositories/PetApiRepository.ts`

```typescript
import { PetApiSchema, PetsResponseSchema } from '../schemas/pet.schemas';

export class PetApiRepository implements IPetRepository {
  async findAll(params?: { limit?: number; offset?: number }): Promise<Pet[]> {
    const response = await gymApi.get(this.basePath, { params });

    // ✅ Validar con Zod
    const validated = PetsResponseSchema.parse(response.data);

    return validated.data.map(pet => PetMapper.toDomain(pet));
  }

  async findById(id: string): Promise<Pet> {
    const { data } = await gymApi.get(`${this.basePath}/${id}`);

    // ✅ Validar con Zod
    const validated = PetApiSchema.parse(data);

    return PetMapper.toDomain(validated);
  }

  // ... resto de métodos igual
}
```

### 3. Actualizar `src/pets/mappers/PetMapper.ts`

```typescript
import type { PetApi, PetsResponseApi } from '../schemas/pet.schemas';

export class PetMapper {
  static toDomain(apiPet: PetApi): Pet {
    return {
      id: apiPet.id,
      name: apiPet.name,
      species: apiPet.species,
      // ...
    };
  }
}
```

---

## 🚨 Manejo de Errores

Zod lanza errores si la validación falla:

```typescript
import { z } from 'zod';

try {
  const { data } = await this.api.get('/appointments');
  const validated = AppointmentApiSchema.parse(data);
  return this.mapper.toDomain(validated);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Validación falló:', error.errors);
    // error.errors contiene array de errores detallados
  }
  throw error;
}
```

---

## 📋 Checklist por Módulo

### ✅ Para cada módulo:

1. [ ] Crear archivo `src/[modulo]/schemas/[modulo].schemas.ts`
2. [ ] Definir schemas Zod para:
   - [ ] Enums
   - [ ] Objetos anidados (nested)
   - [ ] Schema principal
   - [ ] Schema de respuesta paginada (si aplica)
3. [ ] Exportar tipos inferidos con `z.infer<>`
4. [ ] Actualizar `[Modulo]ApiRepository.ts`:
   - [ ] Importar schemas
   - [ ] Quitar `<any>` de llamadas API
   - [ ] Agregar `Schema.parse(data)` antes del mapper
5. [ ] Actualizar `[Modulo]Mapper.ts`:
   - [ ] Importar tipos inferidos
   - [ ] Reemplazar `any` por tipos inferidos
6. [ ] Ejecutar `npm run lint` y verificar 0 errores de `any`

---

## 🎓 Beneficios Obtenidos

### Antes (con `any`)
```typescript
const { data } = await api.get<any>('/pets');
console.log(data.nombre); // ❌ No hay error pero 'nombre' no existe
```

### Después (con Zod)
```typescript
const { data } = await api.get('/pets');
const validated = PetApiSchema.parse(data); // ✅ Valida en runtime
console.log(validated.nombre); // ❌ Error TypeScript: Property 'nombre' does not exist
console.log(validated.name); // ✅ OK
```

---

## 📚 Módulos Pendientes

Los siguientes módulos aún tienen `any` y necesitan este patrón:

- [ ] **Pets** (8 errores en PetMapper)
- [ ] **Medical** (4 errores en MedicalMapper)
- [ ] **Grooming** (2 errores en GroomingMapper)
- [ ] **Services** (7 errores en ServiceMapper + ServiceApiRepository)
- [ ] **Admin** (5 errores en ProductMapper + useServiceMutations)
- [ ] **Cart** (1 error en CartSyncService)

---

## 🔗 Referencias

- [Zod Documentation](https://zod.dev/)
- [Zod Type Inference](https://zod.dev/?id=type-inference)
- [Zod Error Handling](https://zod.dev/?id=error-handling)

---

## ✅ Ejemplo Implementado

El módulo **Appointments** ya está completamente implementado con este patrón:
- ✅ `src/appointments/schemas/appointment.schemas.ts`
- ✅ `src/appointments/repositories/AppointmentApiRepository.ts`
- ✅ `src/appointments/mappers/AppointmentMapper.ts`
- ✅ 0 errores de `any` en ESLint para Appointments

**Resultado:** De 44 errores totales → 29 errores (15 errores eliminados)
