# INSTRUCCIONES DEFINITIVAS PARA DESPLEGAR EN VERCEL

## PROBLEMA IDENTIFICADO
Tu aplicación no se mostraba porque estaba intentando conectarse a `localhost:3000` en producción, lo cual no existe en Vercel.

## CAMBIOS REALIZADOS

### 1. CheckAuthProvider Mejorado
- Ahora tiene un timeout de 3 segundos para evitar bloqueos
- Maneja errores de conexión correctamente
- No bloquea la aplicación si el backend no está disponible

### 2. Configuración de Vite Actualizada ✅ **MEJORADO**
- Eliminado el bloque `define` innecesario - Vite maneja automáticamente las variables `VITE_*`
- Separación de date-fns en su propio chunk
- Pre-bundling de dependencias problemáticas
- Source maps habilitados para debugging

### 3. Variables de Entorno ✅ **NUEVO**
- Archivos `.env`, `.env.example` y `.env.production` creados
- Sistema de variables de entorno configurado correctamente
- `.env` en `.gitignore` para proteger configuración local

### 4. Downgrade de date-fns
- Cambiado de v4.1.0 a v3.6.0 para evitar problemas de inicialización

### 5. Archivo vercel.json Mejorado
- Configuración completa de build y rewrites
- Soporte para variables de entorno

### 6. Dependencias Circulares Eliminadas ✅ **CRÍTICO**
- Import directo en `gymApi.ts` para evitar barrel exports problemáticos
- Lazy initialization en todos los repositorios
- Esto soluciona el error `Cannot access 'W' before initialization` en producción
- Ver `CIRCULAR_DEPENDENCY_FIX.md` para detalles técnicos

## PASOS PARA CONFIGURAR EN VERCEL

### PASO 1: Configurar Variables de Entorno en Vercel

**IMPORTANTE:** La aplicación ahora lee correctamente las variables de entorno usando el sistema nativo de Vite.

1. Ve a tu proyecto en Vercel Dashboard
2. Click en "Settings" → "Environment Variables"
3. Agrega la siguiente variable para **todos los entornos** (Production, Preview, Development):

```
Name: VITE_API_URL
Value: [LA URL DE TU BACKEND]
Environment: Production, Preview, Development
```

> **Nota:** Las variables que empiezan con `VITE_` son públicas y se incluyen en el bundle del cliente. Vite las expone automáticamente como `import.meta.env.VITE_API_URL`.

**OPCIONES PARA EL BACKEND:**

#### Opción A: Si NO tienes backend desplegado
- Usa temporalmente: `https://jsonplaceholder.typicode.com`
- O despliega tu backend en Render/Railway/Heroku primero

#### Opción B: Si tienes backend en Render
- Usa: `https://tu-app.onrender.com/api`

#### Opción C: Si tienes backend en Railway
- Usa: `https://tu-app.railway.app/api`

#### Opción D: Si tienes backend en Heroku
- Usa: `https://tu-app.herokuapp.com/api`

### PASO 2: Hacer Push de los Cambios

Los cambios ya están listos para commit:

```bash
git add .
git commit -m "fix: solución definitiva para despliegue en Vercel - manejo de errores y configuración de producción"
git push
```

### PASO 3: Verificar el Despliegue

1. Vercel detectará automáticamente el push
2. Iniciará un nuevo build
3. Tu aplicación debería estar funcionando

## VERIFICACIÓN POST-DESPLIEGUE

### Si todavía ves pantalla en blanco:

1. **Abre las DevTools del navegador (F12)**
2. **Ve a la pestaña Console**
3. **Busca errores específicos**

### Errores Comunes y Soluciones:

#### Error: "Failed to fetch" o "Network Error"
- **Causa:** La variable VITE_API_URL no está configurada en Vercel
- **Solución:** Asegúrate de configurar la variable en Vercel Dashboard

#### Error: "CORS blocked"
- **Causa:** Tu backend no permite requests desde el dominio de Vercel
- **Solución:** Configura CORS en tu backend para permitir tu dominio de Vercel

#### Error: "404 Not Found" en rutas
- **Causa:** Problema con el routing de SPA
- **Solución:** El vercel.json ya incluye rewrites, debería estar solucionado

## BACKEND TEMPORAL PARA PRUEBAS

Si no tienes un backend desplegado, puedes usar este backend de prueba:

```
VITE_API_URL=https://fakestoreapi.com
```

Esto permitirá que tu aplicación se cargue, aunque obviamente las funcionalidades específicas no funcionarán.

## COMANDO DE EMERGENCIA

Si nada funciona, ejecuta esto localmente para verificar que el build es correcto:

```bash
cd gymnastic/gymnastic-front
npm run build
npm run preview
```

Luego abre http://localhost:4173 y verifica que funciona localmente.

## CONTACTO

Si sigues teniendo problemas después de seguir todas estas instrucciones, el problema podría estar en:
1. La configuración de tu cuenta de Vercel
2. Un problema con el dominio
3. Un error en el código que no se detectó

En ese caso, revisa los logs de Vercel en el Dashboard para más información.