import { type PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/auth/store/auth.store';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';

export const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <CustomFullScreenLoading />;

  return children;
};
