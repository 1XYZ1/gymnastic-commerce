# Especificación API - Citas (Appointments)

## Endpoint Principal

```
GET /appointments?limit=10&offset=0&status=confirmed&serviceId=xxx&dateFrom=xxx&dateTo=xxx
```

## Estructura de Respuesta Esperada

### Respuesta Paginada

El backend **DEBE** devolver la propiedad `appointments` (no `data`):

```json
{
  "appointments": [
    {
      "id": "57fbcc06-a635-45ed-9293-6cfc04ca3e0e",
      "date": "2025-11-10T11:00:00.000Z",
      "status": "confirmed",
      "notes": "Bella necesita tratamiento para ansiedad",
      "createdAt": "2025-11-03T07:56:24.552Z",
      "updatedAt": "2025-11-03T07:56:24.753Z",
      "pet": { /* ver sección PET */ },
      "service": { /* ver sección SERVICE */ },
      "customer": { /* ver sección CUSTOMER */ }
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "pages": 1
}
```

---

## Objeto `pet` (Anidado en Appointment)

El objeto `pet` puede venir **completo** con todos sus campos:

```json
{
  "pet": {
    "id": "e3940a25-f2fd-422c-b34e-8df994e1e785",
    "name": "Bella",
    "species": "dog",
    "breed": "Beagle",
    "birthDate": null,                    // ⚠️ Puede ser null
    "gender": "female",
    "color": "Tricolor",
    "weight": "10.50",                    // String o Number
    "microchipNumber": null,
    "profilePhoto": null,
    "temperament": "nervous",
    "behaviorNotes": [
      "Ansiedad por separación",
      "Ladradora",
      "Muy olfateadora"
    ],
    "generalNotes": "Necesita entrenamiento para ansiedad.",
    "isActive": true,
    "createdAt": "2025-11-03T07:56:22.648Z",
    "updatedAt": "2025-11-03T07:56:22.648Z"
  }
}
```

**Campos importantes:**
- ✅ `birthDate` puede ser `null` (Frontend manejará "Edad desconocida")
- ✅ `weight` acepta string o number
- ✅ `temperament` debe ser uno de: `friendly|aggressive|shy|playful|calm|energetic|nervous|unknown`
- ✅ `behaviorNotes` es un array de strings

---

## Objeto `service` (Anidado en Appointment)

```json
{
  "service": {
    "id": "1dc5d921-1bfe-4fcb-b0ef-b53b8a7b2609",
    "name": "Peluquería Canina Premium",
    "description": "Servicio premium de peluquería...",
    "price": 65,
    "durationMinutes": 150,
    "type": "grooming",              // ✅ ENUM: medical|grooming|veterinary
    "image": "grooming-premium.jpg",
    "isActive": true,
    "createdAt": "2025-11-03T07:56:22.325Z",
    "updatedAt": "2025-11-03T07:56:22.325Z"
  }
}
```

**Notas:**
- ✅ `type` acepta: `"medical"`, `"grooming"`, o `"veterinary"`
- ✅ `image` es opcional
- ✅ `createdAt` y `updatedAt` son opcionales pero recomendados

---

## Objeto `customer` (Anidado en Appointment)

```json
{
  "customer": {
    "id": "050b5821-f3a9-468f-84b1-c4a0ab538ca4",
    "email": "cliente1@petshop.com",
    "fullName": "Ana López",
    "isActive": true,               // ⚠️ OPCIONAL - Frontend lo acepta
    "roles": ["user"]               // ⚠️ OPCIONAL - Frontend lo acepta
  }
}
```

**Notas:**
- ✅ Campos básicos requeridos: `id`, `email`, `fullName`
- ✅ `isActive` y `roles` son opcionales, pero el frontend los acepta si vienen

---

## Appointment Completo - Ejemplo

```json
{
  "id": "57fbcc06-a635-45ed-9293-6cfc04ca3e0e",
  "date": "2025-11-10T11:00:00.000Z",
  "status": "confirmed",                  // ✅ ENUM: pending|confirmed|completed|cancelled
  "notes": "Bella necesita tratamiento",  // ⚠️ OPCIONAL - puede ser null
  "createdAt": "2025-11-03T07:56:24.552Z",
  "updatedAt": "2025-11-03T07:56:24.753Z",
  "pet": {
    "id": "e3940a25-f2fd-422c-b34e-8df994e1e785",
    "name": "Bella",
    "species": "dog",
    "breed": "Beagle",
    "birthDate": null,
    "gender": "female",
    "color": "Tricolor",
    "weight": "10.50",
    "microchipNumber": null,
    "profilePhoto": null,
    "temperament": "nervous",
    "behaviorNotes": ["Ansiedad por separación"],
    "generalNotes": "Necesita entrenamiento.",
    "isActive": true,
    "createdAt": "2025-11-03T07:56:22.648Z",
    "updatedAt": "2025-11-03T07:56:22.648Z"
  },
  "service": {
    "id": "1dc5d921-1bfe-4fcb-b0ef-b53b8a7b2609",
    "name": "Peluquería Canina Premium",
    "description": "Servicio premium...",
    "price": 65,
    "durationMinutes": 150,
    "type": "grooming",
    "image": "grooming-premium.jpg",
    "isActive": true,
    "createdAt": "2025-11-03T07:56:22.325Z",
    "updatedAt": "2025-11-03T07:56:22.325Z"
  },
  "customer": {
    "id": "050b5821-f3a9-468f-84b1-c4a0ab538ca4",
    "email": "cliente1@petshop.com",
    "fullName": "Ana López",
    "isActive": true,
    "roles": ["user"]
  }
}
```

---

## Otros Endpoints de Appointments

### GET /appointments/:id

Devuelve un **objeto appointment individual** (sin paginación):

```json
{
  "id": "57fbcc06-a635-45ed-9293-6cfc04ca3e0e",
  "date": "2025-11-10T11:00:00.000Z",
  "status": "confirmed",
  "notes": "...",
  "pet": { /* ... */ },
  "service": { /* ... */ },
  "customer": { /* ... */ },
  "createdAt": "2025-11-03T07:56:24.552Z",
  "updatedAt": "2025-11-03T07:56:24.753Z"
}
```

### POST /appointments

**Body esperado:**

```json
{
  "petId": "e3940a25-f2fd-422c-b34e-8df994e1e785",
  "serviceId": "1dc5d921-1bfe-4fcb-b0ef-b53b8a7b2609",
  "date": "2025-11-10T11:00:00.000Z",
  "notes": "Notas opcionales"
}
```

**Respuesta:** Un objeto appointment completo (igual que GET /appointments/:id)

### PATCH /appointments/:id

**Body esperado (todos los campos opcionales):**

```json
{
  "date": "2025-11-11T14:00:00.000Z",
  "status": "confirmed",
  "notes": "Notas actualizadas",
  "petId": "nuevo-pet-id",
  "serviceId": "nuevo-service-id"
}
```

**Respuesta:** Appointment actualizado completo

### DELETE /appointments/:id

**Nota:** Este endpoint está **deprecated**. Se recomienda usar PATCH con `status: "cancelled"` en su lugar.

Si se usa, debe devolver el appointment con status actualizado a `"cancelled"`:

```json
{
  "id": "57fbcc06-a635-45ed-9293-6cfc04ca3e0e",
  "status": "cancelled",
  /* resto de campos */
}
```

---

## Enums Importantes

### Status (Estado de la Cita)
```typescript
'pending' | 'confirmed' | 'completed' | 'cancelled'
```

### Service Type (Tipo de Servicio)
```typescript
'medical' | 'grooming' | 'veterinary'
```

### Pet Species (Especies)
```typescript
'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other'
```

### Pet Gender (Género)
```typescript
'male' | 'female' | 'unknown'
```

### Pet Temperament (Temperamento)
```typescript
'friendly' | 'aggressive' | 'shy' | 'playful' | 'calm' | 'energetic' | 'nervous' | 'unknown'
```

---

## Parámetros de Query

### GET /appointments

```
?limit=10           # Número de resultados por página (default: 10)
&offset=0           # Desplazamiento para paginación (default: 0)
&status=confirmed   # Filtrar por status (opcional)
&serviceId=xxx      # Filtrar por servicio (opcional)
&dateFrom=xxx       # Fecha inicio (ISO 8601, opcional)
&dateTo=xxx         # Fecha fin (ISO 8601, opcional)
```

---

## Respuesta Paginada - Campos

```json
{
  "appointments": [],  // ✅ ARRAY de appointments
  "total": 100,        // ✅ Total de registros en DB
  "limit": 10,         // ✅ Límite por página
  "offset": 0,         // ✅ Offset actual
  "pages": 10          // ⚠️ OPCIONAL - Total de páginas
}
```

**IMPORTANTE:** El frontend espera la propiedad `appointments`, NO `data`. Si envías `data`, las citas no se mostrarán.

---

## Campo `petId` - Nota Especial

El frontend **NO requiere** que el campo `petId` esté en el nivel raíz del appointment. Si envías el objeto `pet` completo, el frontend extraerá el `id` de allí:

```json
{
  "id": "appointment-123",
  // ❌ NO ES NECESARIO incluir petId aquí
  "pet": {
    "id": "pet-456",  // ✅ Frontend usa este ID
    "name": "Bella"
  }
}
```

Pero si lo incluyes, también funciona:

```json
{
  "id": "appointment-123",
  "petId": "pet-456",  // ✅ También válido
  "pet": {
    "id": "pet-456",
    "name": "Bella"
  }
}
```

---

## Códigos HTTP

- **200 OK** - Éxito
- **201 Created** - Appointment creado (POST)
- **404 Not Found** - Appointment no encontrado
- **400 Bad Request** - Datos inválidos
- **401 Unauthorized** - No autenticado
- **403 Forbidden** - Sin permisos

---

## Validación del Frontend

El frontend usa **validación segura**:
- ✅ NO rompe si hay errores de validación
- ✅ Loguea warnings en consola
- ✅ Continúa funcionando con datos recibidos

Si ves warnings tipo:
```
⚠️ [Zod Validation] Error in AppointmentApiRepository.getAppointments:
```

Revisa la consola del navegador para ver qué campo tiene problemas.

---

## Ejemplo Real de Tu Backend

Este es el formato que tu backend ya está enviando (✅ CORRECTO):

```json
{
  "appointments": [
    {
      "id": "57fbcc06-a635-45ed-9293-6cfc04ca3e0e",
      "date": "2025-11-10T11:00:00.000Z",
      "status": "confirmed",
      "notes": "Bella necesita tratamiento para ansiedad",
      "createdAt": "2025-11-03T07:56:24.552Z",
      "updatedAt": "2025-11-03T07:56:24.753Z",
      "pet": {
        "id": "e3940a25-f2fd-422c-b34e-8df994e1e785",
        "name": "Bella",
        "species": "dog",
        "breed": "Beagle",
        "birthDate": null,
        "gender": "female",
        "color": "Tricolor",
        "weight": "10.50",
        "microchipNumber": null,
        "profilePhoto": null,
        "temperament": "nervous",
        "behaviorNotes": [
          "Ansiedad por separación",
          "Ladradora",
          "Muy olfateadora"
        ],
        "generalNotes": "Necesita entrenamiento para ansiedad.",
        "isActive": true,
        "createdAt": "2025-11-03T07:56:22.648Z",
        "updatedAt": "2025-11-03T07:56:22.648Z"
      },
      "service": {
        "id": "1dc5d921-1bfe-4fcb-b0ef-b53b8a7b2609",
        "name": "Peluquería Canina Premium",
        "description": "Servicio premium de peluquería que incluye todo lo del servicio básico más corte de pelo según raza o preferencia, cepillado profundo, hidratación del pelaje, perfume especial y moño decorativo.",
        "price": 65,
        "durationMinutes": 150,
        "type": "grooming",
        "image": "grooming-premium.jpg",
        "isActive": true,
        "createdAt": "2025-11-03T07:56:22.325Z",
        "updatedAt": "2025-11-03T07:56:22.325Z"
      },
      "customer": {
        "id": "050b5821-f3a9-468f-84b1-c4a0ab538ca4",
        "email": "cliente1@petshop.com",
        "fullName": "Ana López",
        "isActive": true,
        "roles": ["user"]
      }
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "pages": 1
}
```

**✅ Este formato es correcto y el frontend ya está actualizado para manejarlo.**
