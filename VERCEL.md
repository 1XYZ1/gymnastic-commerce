# Vercel Deployment Configuration

Este documento detalla la configuración necesaria para desplegar el frontend en Vercel.

## Variables de Entorno

Para que la aplicación funcione correctamente en Vercel, debes configurar las siguientes variables de entorno en el panel de Vercel:

### Configuración en Vercel Dashboard

1. Ve a tu proyecto en Vercel Dashboard
2. Click en **Settings** > **Environment Variables**
3. Agrega la siguiente variable:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_URL` | URL de tu backend API | URL completa del backend (ej: `https://api.tudominio.com/api`) |

### Ejemplo de Valor

Para producción:
```
VITE_API_URL=https://pet-shop-api.tudominio.com/api
```

Para desarrollo/staging:
```
VITE_API_URL=https://dev-api.tudominio.com/api
```

## Configuración de Build

El archivo `vercel.json` ya incluye la configuración necesaria:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Explicación

- **buildCommand**: Comando para construir la aplicación (ejecuta TypeScript check + Vite build)
- **outputDirectory**: Carpeta donde se genera el build (`dist/`)
- **framework**: Framework utilizado (Vite)
- **installCommand**: Comando para instalar dependencias
- **rewrites**: Redirige todas las rutas a `index.html` para que funcione el routing de React Router

## Verificación Post-Deployment

Después del deployment, verifica:

1. ✅ La página principal carga correctamente
2. ✅ El routing funciona (navegación entre páginas)
3. ✅ La consola del navegador no muestra errores de CORS
4. ✅ La aplicación puede conectarse al backend API

## Troubleshooting

### La página aparece en blanco

**Causa**: Variable de entorno `VITE_API_URL` no configurada o incorrecta

**Solución**:
1. Verifica que `VITE_API_URL` esté configurada en Vercel
2. Asegúrate de que la URL del backend sea correcta y accesible
3. Re-deploy la aplicación desde Vercel Dashboard

### Errores de CORS

**Causa**: El backend no permite requests desde el dominio de Vercel

**Solución**: Configura CORS en el backend para permitir el dominio de Vercel:
```typescript
// En pet-shop-back/src/main.ts
app.enableCors({
  origin: ['https://tuapp.vercel.app', 'https://www.tudominio.com'],
  credentials: true
})
```

### Rutas 404

**Causa**: El archivo `vercel.json` no está configurado correctamente

**Solución**: Asegúrate de que `vercel.json` contenga la configuración de rewrites

## Comandos Útiles

Probar el build localmente antes de desplegar:
```bash
npm run build
npm run preview
```

Ver logs de Vercel:
```bash
vercel logs <deployment-url>
```

Re-deploy manualmente:
```bash
vercel --prod
```
