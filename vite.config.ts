import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Configuración para manejar variables de entorno y fallbacks
  define: {
    // Fallback para API URL si no está definida
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://api.example.com/api'
    ),
  },
  optimizeDeps: {
    // Pre-bundle estas dependencias para evitar problemas de ESM
    include: [
      'react',
      'react-dom',
      'react-router',
      '@tanstack/react-query',
      'date-fns',
      'date-fns/locale/es',
      'axios',
      'zustand'
    ],
  },
  build: {
    // Generar source maps para debugging en producción
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks - Librerías grandes separadas
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('yup') || id.includes('zod')) {
              return 'form-vendor';
            }
            // Separar date-fns en su propio chunk
            if (id.includes('date-fns')) {
              return 'date-fns-vendor';
            }
            if (id.includes('lucide-react') || id.includes('sonner')) {
              return 'ui-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'radix-vendor';
            }
            if (id.includes('axios') || id.includes('zustand')) {
              return 'utils-vendor';
            }
          }

          // Module chunks - Módulos de la aplicación
          if (id.includes('src/admin')) {
            return 'admin';
          }
          if (id.includes('src/shop')) {
            return 'shop';
          }
          if (id.includes('src/auth')) {
            return 'auth';
          }
          if (id.includes('src/pets')) {
            return 'pets';
          }
          if (id.includes('src/appointments')) {
            return 'appointments';
          }
          if (id.includes('src/services')) {
            return 'services';
          }
          if (id.includes('src/medical')) {
            return 'medical';
          }
          if (id.includes('src/grooming')) {
            return 'grooming';
          }
        },
      },
    },
    // Aumentar el límite de advertencia de chunk size
    chunkSizeWarningLimit: 600,
  },
});
