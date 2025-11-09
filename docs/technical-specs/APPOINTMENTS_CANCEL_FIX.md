# Fix: Cancelación de Citas (403 Forbidden)

## Problema Detectado

Al intentar cancelar una cita como usuario normal, aparecía un error 403:

```json
{
  "message": "Solo los administradores pueden cambiar el estado de la cita",
  "error": "Forbidden",
  "statusCode": 403
}
```

## Causa Raíz

El código estaba usando `PATCH /appointments/:id` con `{ status: 'cancelled' }` para **todos los usuarios**, pero el backend **solo permite a los administradores** cambiar el status usando ese endpoint.

## Arquitectura del Backend

El backend tiene dos formas de cancelar citas:

### 1. DELETE /appointments/:id
- **Permisos**: Usuario propietario de la cita o Admin
- **Acción**: Elimina o marca la cita como cancelada
- **Uso**: Usuarios normales cancelan sus propias citas

### 2. PATCH /appointments/:id con { status: 'cancelled' }
- **Permisos**: Solo Administradores
- **Acción**: Cambia el estado de cualquier cita
- **Uso**: Admins gestionan estados de todas las citas

## Solución Implementada

### Frontend: Lógica Condicional

```typescript
const handleCancel = () => {
  if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
    if (isAdmin) {
      // Admins usan PATCH para cambiar el status
      updateAppointment.mutate({
        id: appointment.id,
        dto: { status: 'cancelled' },
      });
    } else {
      // Usuarios normales usan DELETE
      cancelAppointment.mutate(appointment.id);
    }
  }
};
```

### Archivos Modificados

1. **AppointmentCard.tsx**
   - Importa ambos hooks: `updateAppointment` y `cancelAppointment`
   - Lógica condicional en `handleCancel`
   - Estados de loading condicionales en botón

2. **AppointmentDetailPage.tsx**
   - Misma lógica condicional
   - Aplicada a botones de pending y confirmed

## Verificación

### Usuario Normal (no admin)
```bash
# Método usado
DELETE /appointments/{id}

# Respuesta esperada
200 OK
```

### Administrador
```bash
# Método usado
PATCH /appointments/{id}
Body: { "status": "cancelled" }

# Respuesta esperada
200 OK
```

## Código de Ejemplo

### Antes (❌ Incorrecto)
```typescript
// Todos usaban PATCH - Fallaba para usuarios normales
updateAppointment.mutate({
  id: appointment.id,
  dto: { status: 'cancelled' },
});
```

### Después (✅ Correcto)
```typescript
// Lógica condicional basada en rol
if (isAdmin) {
  updateAppointment.mutate({ id, dto: { status: 'cancelled' } });
} else {
  cancelAppointment.mutate(id);
}
```

## Testing

1. **Como Usuario Normal**:
   - ✅ Puede cancelar sus propias citas
   - ✅ No puede cambiar status de citas de otros
   - ✅ Usa DELETE endpoint

2. **Como Admin**:
   - ✅ Puede cancelar cualquier cita
   - ✅ Puede confirmar/completar citas
   - ✅ Usa PATCH endpoint

## Notas Importantes

- Los usuarios normales NO tienen el botón "Cancelar" visible en citas de otros usuarios
- La validación `isOwner || isAdmin` en el UI previene acciones no autorizadas
- El backend tiene su propia capa de seguridad que valida permisos
