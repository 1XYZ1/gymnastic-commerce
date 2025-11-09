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
  build: {
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
            if (id.includes('lucide-react') || id.includes('sonner') || id.includes('date-fns')) {
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
