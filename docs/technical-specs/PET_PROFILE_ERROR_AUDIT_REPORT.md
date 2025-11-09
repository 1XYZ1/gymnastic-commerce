# Reporte de Auditoría: Error en Perfil de Mascota

**Fecha:** 2025-11-03
**Ruta Afectada:** `/pets/:petId/profile` (CompletePetProfilePage)
**Error:** `RangeError: Invalid time value` en `formatDistanceToNow`
**Componente:** `PetActivityTimeline.tsx:125`

---

## 1. Resumen Ejecutivo

El error `RangeError: Invalid time value` ocurre cuando el componente `PetActivityTimeline` intenta formatear fechas inválidas usando `date-fns`. El problema raíz es una **cadena de fallos en validación y transformación de datos** que permite que fechas nulas, indefinidas o mal formateadas lleguen hasta el componente de UI.

### Severidad: **CRÍTICA** 🔴

- Rompe completamente la página de perfil de mascota
- Impide a los usuarios ver información vital de sus mascotas
- Afecta múltiples tipos de datos (médicos, grooming, citas, vacunas)

---

## 2. Flujo de Datos y Puntos de Falla

```
API Backend
    ↓
[1] PetApiRepository.getCompleteProfile()
    ↓ (valida con Zod)
[2] CompletePetProfileSchema (Zod)
    ↓ (usa safeValidate)
[3] safeValidate()
    ↓ (transforma datos)
[4] PetMapper.completeProfileToDomain()
    ↓
[5] CompleteProfile (tipo TypeScript)
    ↓
[6] PetActivityTimeline.tsx
    ↓
[7] formatDistanceToNow() ❌ ERROR
```

### Análisis de Puntos de Falla:

#### **[2] CompletePetProfileSchema - FALLA CRÍTICA**
**Ubicación:** `src/pets/schemas/pet.schemas.ts:85-118`

**Problema:**
```typescript
medicalHistory: z.object({
  recentVisits: z.array(z.any()).default([]),  // ❌ NO valida estructura
  totalVisits: z.number().default(0),
}),
vaccinations: z.object({
  activeVaccines: z.array(z.any()).default([]),  // ❌ NO valida estructura
  upcomingVaccines: z.array(z.any()).default([]), // ❌ NO valida estructura
  totalVaccines: z.number().default(0),
}),
groomingHistory: z.object({
  recentSessions: z.array(z.any()).default([]),  // ❌ NO valida estructura
  totalSessions: z.number().default(0),
  lastSessionDate: z.string().nullable().optional(),
}),
appointments: z.object({
  upcoming: z.array(z.any()).default([]),  // ❌ NO valida estructura
  past: z.array(z.any()).default([]),      // ❌ NO valida estructura
  totalAppointments: z.number().default(0),
}),
```

**Consecuencia:** Permite que datos con fechas inválidas (null, undefined, "") pasen la validación sin detección.

---

#### **[3] safeValidate() - FALLA SECUNDARIA**
**Ubicación:** `src/lib/zod-helpers.ts:12-30`

**Problema:**
```typescript
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  // ⚠️ Si falla, retorna datos SIN validar
  console.warn(`⚠️ [Zod Validation] Error in ${context}:`);
  console.warn('Validation errors:', result.error.format());
  console.warn('Raw data:', data);

  return data as T;  // ❌ CAST INSEGURO
}
```

**Consecuencia:** Si el schema falla (por datos mal formados), retorna los datos originales sin transformación ni validación, asumiendo que son del tipo `T` cuando podrían no serlo.

---

#### **[4] PetMapper.completeProfileToDomain() - MÚLTIPLES FALLAS CRÍTICAS**
**Ubicación:** `src/pets/mappers/PetMapper.ts:35-94`

##### **Falla 4.1: NO mapea el campo `appointments`**

**El mapper NO incluye transformación de `appointments`:**
```typescript
static completeProfileToDomain(apiProfile: CompletePetProfileApi): CompleteProfile {
  return {
    ...apiProfile,
    pet: this.toDomain(apiProfile.pet),
    medicalHistory: { /* ... */ },
    vaccinations: { /* ... */ },
    weightHistory: { /* ... */ },
    groomingHistory: { /* ... */ },
    summary: { /* ... */ },
    // ❌ FALTA: appointments
  };
}
```

**Consecuencia:** El campo `appointments` del API se pasa directamente sin transformación de fechas.

---

##### **Falla 4.2: Transformación de fechas sin validación**

**Código problemático:**
```typescript
// Línea 44 - Medical visits
visitDate: new Date(visit.visitDate),  // ❌ No valida si es null/undefined

// Línea 54 - Vaccinations
administeredDate: new Date(vaccine.administeredDate),  // ❌ No valida

// Línea 79 - Grooming sessions
sessionDate: new Date(session.sessionDate),  // ❌ No valida
```

**Escenarios de Fallo:**
```javascript
new Date(null)        // → Invalid Date
new Date(undefined)   // → Invalid Date
new Date("")          // → Invalid Date
new Date("invalid")   // → Invalid Date
```

**Consecuencia:** Si el API devuelve `null`, `undefined`, o strings vacíos, se crean objetos `Date` inválidos que causan errores al intentar formatearlos.

---

#### **[6] PetActivityTimeline.tsx - FALLA DE COMPONENTE**
**Ubicación:** `src/pets/pages/complete-profile/components/PetActivityTimeline.tsx:28-128`

##### **Falla 6.1: Procesa appointments sin validar fechas**

**Código problemático (líneas 86-103):**
```typescript
// Agregar citas (solo pasadas/completadas, con validaciones)
profile.appointments?.past?.forEach((appointment) => {
  if (!appointment?.id || !appointment?.date || !appointment?.service) return;

  // ⚠️ Valida que exista, pero NO valida que sea una fecha válida
  events.push({
    id: `appointment-${appointment.id}`,
    type: 'appointment',
    title: 'Cita completada',
    description: `${appointment.service.name || 'Servicio'} - ${serviceType}`,
    date: new Date(appointment.date),  // ❌ Puede crear Invalid Date
    // ...
  });
});
```

**Problema:**
- Valida que `appointment.date` exista (`!appointment?.date`)
- Pero NO valida que sea una fecha válida
- Si `appointment.date` es `""` o `"invalid"`, pasa la validación pero crea `Invalid Date`

---

##### **Falla 6.2: No valida fechas en otros tipos de eventos**

**Mismo problema en:**
- Línea 41: `date: new Date(record.visitDate)` (medical visits)
- Línea 57: `date: new Date(vac.administeredDate)` (vaccinations)
- Línea 78: `date: new Date(session.sessionDate)` (grooming)

---

##### **Falla 6.3: formatDistanceToNow con Invalid Date**

**Código problemático (línea 125):**
```typescript
const timeAgo = formatDistanceToNow(activity.date, {
  addSuffix: true,
  locale: es,
});  // ❌ ERROR: RangeError: Invalid time value
```

**Causa:** `date-fns` no puede formatear un objeto `Date` inválido.

---

## 3. Evidencia de Inconsistencias de Tipos

### Inconsistencia 1: Tipo `Appointment`

**Definición en `appointment.types.ts:30-41`:**
```typescript
export interface Appointment {
  id: string;
  date: string;  // ⚠️ Definido como string
  status: AppointmentStatus;
  // ...
}
```

**Uso en `CompleteProfile` (`complete-profile.types.ts:38-40`):**
```typescript
appointments: {
  upcoming: AppointmentPet[];  // AppointmentPet = Appointment
  past: AppointmentPet[];      // Tipo dice que date es string
  totalAppointments: number;
}
```

**Problema:** El tipo dice que `appointment.date` es `string`, pero el componente lo trata como si debiera transformarse a `Date`.

---

### Inconsistencia 2: Tipos de otros módulos

**MedicalRecord (`medical.types.ts:11-30`):**
```typescript
export interface MedicalRecord {
  visitDate: Date | string;  // ✅ Acepta ambos
  // ...
}
```

**GroomingRecord (`grooming.types.ts:11-31`):**
```typescript
export interface GroomingRecord {
  sessionDate: Date | string;  // ✅ Acepta ambos
  // ...
}
```

**Vaccination (`medical.types.ts:32-45`):**
```typescript
export interface Vaccination {
  administeredDate: Date | string;  // ✅ Acepta ambos
  nextDueDate?: Date | string;      // ✅ Acepta ambos
  // ...
}
```

**Conclusión:** Hay inconsistencia. Medical, Grooming y Vaccination aceptan `Date | string`, pero Appointment solo acepta `string`.

---

## 4. Escenarios de Fallo Identificados

### Escenario A: API devuelve fecha null
```json
{
  "appointments": {
    "past": [
      {
        "id": "123",
        "date": null,
        "service": { "name": "Consulta" }
      }
    ]
  }
}
```
**Resultado:**
1. ✅ Pasa Zod (z.any() acepta null)
2. ✅ Pasa safeValidate
3. ❌ Mapper no transforma (appointments no mapeado)
4. ❌ Componente hace `new Date(null)` → Invalid Date
5. ❌ formatDistanceToNow → **RangeError**

---

### Escenario B: API devuelve string vacío
```json
{
  "medicalHistory": {
    "recentVisits": [
      {
        "id": "456",
        "visitDate": ""
      }
    ]
  }
}
```
**Resultado:**
1. ✅ Pasa Zod (z.any() acepta "")
2. ✅ Pasa safeValidate
3. ❌ Mapper hace `new Date("")` → Invalid Date
4. ❌ Componente recibe Invalid Date
5. ❌ formatDistanceToNow → **RangeError**

---

### Escenario C: API devuelve formato incorrecto
```json
{
  "vaccinations": {
    "activeVaccines": [
      {
        "id": "789",
        "administeredDate": "not-a-date"
      }
    ]
  }
}
```
**Resultado:**
1. ✅ Pasa Zod (z.any() acepta cualquier string)
2. ✅ Pasa safeValidate
3. ❌ Mapper hace `new Date("not-a-date")` → Invalid Date
4. ❌ Componente recibe Invalid Date
5. ❌ formatDistanceToNow → **RangeError**

---

## 5. Análisis de Validación de Zod

### Schemas Existentes

#### ✅ **BUENO: Appointment Schema**
**Ubicación:** `src/appointments/schemas/appointment.schemas.ts:72-83`

```typescript
export const AppointmentApiSchema = z.object({
  id: z.string(),
  date: z.string(),  // ✅ Valida que sea string (ISO 8601)
  status: AppointmentStatusSchema,
  notes: z.string().optional().nullable(),
  petId: z.string().optional(),
  pet: PetNestedSchema,
  service: ServiceNestedSchema,  // ✅ Valida estructura completa
  customer: UserNestedSchema,     // ✅ Valida estructura completa
  createdAt: z.string(),
  updatedAt: z.string(),
});
```

**Fortaleza:** Valida completamente la estructura de appointments, incluyendo servicios y clientes anidados.

---

#### ❌ **MALO: CompletePetProfile Schema**
**Ubicación:** `src/pets/schemas/pet.schemas.ts:85-118`

```typescript
export const CompletePetProfileSchema = z.object({
  pet: PetApiSchema,  // ✅ Valida correctamente
  medicalHistory: z.object({
    recentVisits: z.array(z.any()).default([]),  // ❌ NO valida
    totalVisits: z.number().default(0),
  }).default({ recentVisits: [], totalVisits: 0 }),
  // ... similar para otros campos con z.any()
});
```

**Debilidad:** Usa `z.any()` para todos los arrays anidados, deshabilitando completamente la validación runtime.

---

### ¿Por qué se usó z.any()?

**Comentarios en el código sugieren que es temporal:**

```typescript
// PetMapper.ts línea 41
// Temporal: se reemplazará con MedicalVisitApi cuando implementemos medical.schemas.ts

// PetMapper.ts línea 51
// Temporal: se reemplazará con VaccinationApi cuando implementemos medical.schemas.ts

// PetMapper.ts línea 76
// Temporal: se reemplazará con GroomingSessionApi cuando implementemos grooming.schemas.ts
```

**Problema:** Los schemas "temporales" nunca se implementaron, dejando la aplicación vulnerable.

---

## 6. Impacto del Error

### Funcionalidad Afectada

1. **CompletePetProfilePage completa** - No se puede visualizar
2. **PetOverviewTab** - Rompe el timeline de actividades
3. **Historial médico** - Invisible si hay fechas inválidas
4. **Historial de grooming** - Invisible si hay fechas inválidas
5. **Citas pasadas/futuras** - No se muestran si hay fechas inválidas

### Experiencia de Usuario

- 🚫 Usuario no puede ver información de su mascota
- 🚫 Usuario no puede acceder a registros médicos
- 🚫 Usuario no puede ver próximas citas
- 😡 Frustración y pérdida de confianza

### Riesgo de Negocio

- Pérdida de usuarios debido a funcionalidad rota
- Imposibilidad de gestionar citas y servicios
- Datos críticos (médicos, vacunas) inaccesibles

---

## 7. Soluciones Recomendadas

### Solución 1: Mejorar Schemas de Zod (PRIORITARIA)

**Crear schemas específicos para cada tipo de dato anidado:**

```typescript
// medical.schemas.ts
export const MedicalRecordApiSchema = z.object({
  id: z.string(),
  visitDate: z.string().refine(
    (date) => !isNaN(new Date(date).getTime()),
    { message: "Invalid date format" }
  ),
  reason: z.string(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  weightAtVisit: z.number().optional(),
  temperature: z.number().optional(),
  serviceCost: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// vaccination.schemas.ts
export const VaccinationApiSchema = z.object({
  id: z.string(),
  vaccineName: z.string(),
  administeredDate: z.string().refine(
    (date) => !isNaN(new Date(date).getTime()),
    { message: "Invalid date format" }
  ),
  nextDueDate: z.string().optional().nullable(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

// grooming.schemas.ts
export const GroomingRecordApiSchema = z.object({
  id: z.string(),
  sessionDate: z.string().refine(
    (date) => !isNaN(new Date(date).getTime()),
    { message: "Invalid date format" }
  ),
  servicesPerformed: z.array(z.string()),
  hairStyle: z.string().optional(),
  productsUsed: z.array(z.string()).optional(),
  skinCondition: z.string().optional(),
  coatCondition: z.string().optional(),
  behaviorDuringSession: z.string().optional(),
  observations: z.string().optional(),
  recommendations: z.string().optional(),
  durationMinutes: z.number(),
  serviceCost: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
```

**Actualizar CompletePetProfileSchema:**

```typescript
import { MedicalRecordApiSchema } from '@/medical/schemas/medical.schemas';
import { VaccinationApiSchema } from '@/medical/schemas/vaccination.schemas';
import { GroomingRecordApiSchema } from '@/grooming/schemas/grooming.schemas';
import { AppointmentApiSchema } from '@/appointments/schemas/appointment.schemas';

export const CompletePetProfileSchema = z.object({
  pet: PetApiSchema,
  medicalHistory: z.object({
    recentVisits: z.array(MedicalRecordApiSchema).default([]),  // ✅ Validación completa
    totalVisits: z.number().default(0),
  }).default({ recentVisits: [], totalVisits: 0 }),
  vaccinations: z.object({
    activeVaccines: z.array(VaccinationApiSchema).default([]),  // ✅ Validación completa
    upcomingVaccines: z.array(VaccinationApiSchema).default([]), // ✅ Validación completa
    totalVaccines: z.number().default(0),
  }).default({ activeVaccines: [], upcomingVaccines: [], totalVaccines: 0 }),
  groomingHistory: z.object({
    recentSessions: z.array(GroomingRecordApiSchema).default([]),  // ✅ Validación completa
    totalSessions: z.number().default(0),
    lastSessionDate: z.string().nullable().optional(),
  }).default({ recentSessions: [], totalSessions: 0, lastSessionDate: null }),
  appointments: z.object({
    upcoming: z.array(AppointmentApiSchema).default([]),  // ✅ Validación completa
    past: z.array(AppointmentApiSchema).default([]),      // ✅ Validación completa
    totalAppointments: z.number().default(0),
  }).default({ upcoming: [], past: [], totalAppointments: 0 }),
  // ...
});
```

---

### Solución 2: Completar el Mapper (CRÍTICA)

**Agregar mapeo de appointments:**

```typescript
// PetMapper.ts
static completeProfileToDomain(apiProfile: CompletePetProfileApi): CompleteProfile {
  return {
    ...apiProfile,
    pet: this.toDomain(apiProfile.pet),
    medicalHistory: { /* ... */ },
    vaccinations: { /* ... */ },
    weightHistory: { /* ... */ },
    groomingHistory: { /* ... */ },

    // ✅ AGREGAR: Mapeo de appointments
    appointments: {
      upcoming: apiProfile.appointments?.upcoming?.map((apt: any) => ({
        ...apt,
        date: apt.date,  // Ya es string, no necesita transformación
      })) || [],
      past: apiProfile.appointments?.past?.map((apt: any) => ({
        ...apt,
        date: apt.date,  // Ya es string, no necesita transformación
      })) || [],
      totalAppointments: apiProfile.appointments?.totalAppointments || 0,
    },

    summary: { /* ... */ },
  };
}
```

**Nota:** Dado que `Appointment.date` se define como `string` en los tipos, NO debe transformarse a `Date` en el mapper.

---

### Solución 3: Validar Fechas en el Mapper (CRÍTICA)

**Función helper para validar fechas:**

```typescript
// PetMapper.ts

/**
 * Transforma un string a Date solo si es una fecha válida
 * Si la fecha es inválida, retorna undefined
 */
private static toSafeDate(dateString: any): Date | undefined {
  if (!dateString) return undefined;

  const date = new Date(dateString);

  // Verificar si es una fecha válida
  if (isNaN(date.getTime())) {
    console.warn(`⚠️ [PetMapper] Invalid date detected: "${dateString}"`);
    return undefined;
  }

  return date;
}
```

**Usar en transformaciones:**

```typescript
static completeProfileToDomain(apiProfile: CompletePetProfileApi): CompleteProfile {
  return {
    medicalHistory: {
      ...apiProfile.medicalHistory,
      recentVisits: apiProfile.medicalHistory?.recentVisits
        ?.map((visit: any) => {
          const visitDate = this.toSafeDate(visit.visitDate);
          if (!visitDate) return null;  // Filtrar registros inválidos

          return {
            ...visit,
            visitDate,
            createdAt: this.toSafeDate(visit.createdAt) || new Date(),
            updatedAt: this.toSafeDate(visit.updatedAt) || new Date(),
          };
        })
        .filter(Boolean) || [],  // Eliminar nulls
    },
    // Similar para vaccinations y groomingHistory
  };
}
```

---

### Solución 4: Proteger el Componente (IMPORTANTE)

**Validar fechas en PetActivityTimeline:**

```typescript
// PetActivityTimeline.tsx

// Helper para validar fechas
function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function PetActivityTimeline({ profile }: PetActivityTimelineProps) {
  const activities = useMemo(() => {
    const events: ActivityEvent[] = [];

    // Medical visits
    profile.medicalHistory?.recentVisits?.forEach((record) => {
      if (!record?.id || !record?.visitDate) return;

      const date = new Date(record.visitDate);
      if (!isValidDate(date)) {
        console.warn(`⚠️ Invalid visitDate for medical record ${record.id}`);
        return;  // ✅ Saltar este registro
      }

      events.push({
        id: `medical-${record.id}`,
        type: 'medical',
        title: 'Consulta médica',
        description: record.reason || 'Visita médica general',
        date,  // ✅ Fecha validada
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      });
    });

    // Similar para vaccinations, grooming, appointments

    return events
      .filter(event => isValidDate(event.date))  // ✅ Filtro final
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  }, [profile]);

  // ...
}
```

---

### Solución 5: Mejorar safeValidate (RECOMENDADA)

**Opción A: Modo estricto por defecto**

```typescript
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string,
  options: { strict?: boolean } = { strict: false }
): T {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  // Loguear error
  console.warn(`⚠️ [Zod Validation] Error in ${context}:`);
  console.warn('Validation errors:', result.error.format());
  console.warn('Raw data:', data);

  // Si es modo estricto, lanzar error
  if (options.strict) {
    throw new Error(`Zod validation failed in ${context}`);
  }

  // Fallback: retornar datos sin validar
  return data as T;
}
```

**Opción B: Usar strictValidate en repositorios críticos**

```typescript
// PetApiRepository.ts
async getCompleteProfile(id: string): Promise<CompleteProfile> {
  const { data } = await gymApi.get(`${this.basePath}/${id}/complete-profile`);

  // Usar validación estricta
  const validated = strictValidate(
    CompletePetProfileSchema,
    data,
    'PetApiRepository.getCompleteProfile'
  );

  return PetMapper.completeProfileToDomain(validated);
}
```

---

## 8. Plan de Implementación

### Fase 1: Hotfix Inmediato (1-2 horas)
**Objetivo:** Detener el error y hacer la página funcional

1. ✅ Agregar validación de fechas en `PetActivityTimeline`
   - Filtrar eventos con fechas inválidas
   - Evitar que el error rompa la página

2. ✅ Agregar mapeo de `appointments` en `PetMapper`
   - Asegurar que las citas se manejen correctamente

**Archivos a modificar:**
- `src/pets/pages/complete-profile/components/PetActivityTimeline.tsx`
- `src/pets/mappers/PetMapper.ts`

---

### Fase 2: Fix Estructural (4-6 horas)
**Objetivo:** Validación adecuada en todo el flujo

1. ✅ Crear schemas de Zod específicos:
   - `src/medical/schemas/medical.schemas.ts`
   - `src/medical/schemas/vaccination.schemas.ts`
   - `src/grooming/schemas/grooming.schemas.ts`

2. ✅ Actualizar `CompletePetProfileSchema`
   - Reemplazar `z.any()` con schemas específicos

3. ✅ Implementar `toSafeDate()` en mapper
   - Validar fechas antes de transformar

**Archivos a crear/modificar:**
- `src/medical/schemas/medical.schemas.ts` (nuevo)
- `src/medical/schemas/vaccination.schemas.ts` (nuevo)
- `src/grooming/schemas/grooming.schemas.ts` (nuevo)
- `src/pets/schemas/pet.schemas.ts`
- `src/pets/mappers/PetMapper.ts`

---

### Fase 3: Refactorización (2-3 horas)
**Objetivo:** Mejorar la arquitectura

1. ✅ Usar `strictValidate` en repositorios críticos
2. ✅ Agregar tests unitarios para mappers
3. ✅ Documentar validaciones de Zod

**Archivos a modificar:**
- `src/lib/zod-helpers.ts`
- `src/pets/repositories/PetApiRepository.ts`
- Tests (nuevos)

---

## 9. Prevención de Futuros Errores

### Reglas de Código

1. **NUNCA usar `z.any()` en schemas de producción**
   - Si la estructura es desconocida, usar `z.unknown()` y validar manualmente
   - Preferir schemas específicos siempre que sea posible

2. **SIEMPRE validar fechas antes de transformarlas**
   - Usar helper `toSafeDate()` en mappers
   - Filtrar datos inválidos en lugar de crashear

3. **USAR validación estricta en repositorios de perfil/usuario**
   - Datos críticos deben fallar rápido y visiblemente
   - `safeValidate` solo para datos opcionales/secundarios

4. **MANTENER consistencia de tipos**
   - Si `Appointment.date` es `string`, mantenerlo como `string` en todos lados
   - O convertir a `Date` en TODOS lados (consistencia es clave)

---

### Herramientas Recomendadas

1. **ESLint rule personalizada:**
   ```javascript
   // Detectar new Date() sin validación
   "no-unsafe-date-construction": "error"
   ```

2. **TypeScript strict mode:**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noUncheckedIndexedAccess": true
     }
   }
   ```

3. **Tests de schema:**
   ```typescript
   describe('CompletePetProfileSchema', () => {
     it('should reject invalid dates', () => {
       const invalid = {
         medicalHistory: {
           recentVisits: [{ visitDate: null }]
         }
       };

       expect(() => CompletePetProfileSchema.parse(invalid)).toThrow();
     });
   });
   ```

---

## 10. Conclusión

El error es el resultado de **múltiples capas de validación fallidas** que permitieron que datos malformados llegaran hasta el componente de UI. La solución requiere:

1. ✅ **Hotfix inmediato** en el componente (Fase 1)
2. ✅ **Fix estructural** en schemas y mappers (Fase 2)
3. ✅ **Mejoras de arquitectura** (Fase 3)

**Prioridad de implementación:**
1. Fase 1 (hotfix) - **INMEDIATO**
2. Fase 2 (schemas) - **URGENTE** (esta semana)
3. Fase 3 (refactor) - **IMPORTANTE** (próximo sprint)

---

## 11. Archivos Críticos Identificados

### Requieren Modificación Inmediata:
1. `src/pets/pages/complete-profile/components/PetActivityTimeline.tsx:125`
2. `src/pets/mappers/PetMapper.ts:35-94`
3. `src/pets/schemas/pet.schemas.ts:85-118`

### Requieren Creación:
1. `src/medical/schemas/medical.schemas.ts`
2. `src/medical/schemas/vaccination.schemas.ts`
3. `src/grooming/schemas/grooming.schemas.ts`

### Requieren Revisión:
1. `src/lib/zod-helpers.ts:12-30`
2. `src/pets/repositories/PetApiRepository.ts:33-40`
3. `src/pets/types/complete-profile.types.ts`

---

**Reporte generado el:** 2025-11-03
**Auditor:** Claude Code (Análisis Automático)
**Severidad final:** 🔴 CRÍTICA
**Acción requerida:** INMEDIATA
