/**
 * Componente SuspenseLoader
 *
 * Wrapper de Suspense para lazy loading con loading fallback centralizado
 */

import { Suspense } from 'react';
import { CustomFullScreenLoading } from './CustomFullScreenLoading';

type SuspenseLoaderProps = {
  children: React.ReactNode;
};

/**
 * Envuelve componentes lazy-loaded con Suspense
 * Muestra un loader de pantalla completa mientras carga
 */
export const SuspenseLoader = ({ children }: SuspenseLoaderProps) => {
  return (
    <Suspense fallback={<CustomFullScreenLoading />}>
      {children}
    </Suspense>
  );
};
