import { type PropsWithChildren, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/auth/store/auth.store';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';

export const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus } = useAuthStore();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { isLoading, error } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    // Si hay error o después de 3 segundos, marcar como carga completa
    // Esto evita que la app se quede bloqueada si no puede conectar con el backend
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 3000);

    if (error) {
      setInitialLoadComplete(true);
    }

    return () => clearTimeout(timer);
  }, [error]);

  // Solo mostrar loading en la carga inicial y por máximo 3 segundos
  if (isLoading && !initialLoadComplete && !error) {
    return <CustomFullScreenLoading />;
  }

  return children;
};
