import { useAuthStore } from '@/auth/store/auth.store';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { AuthRouteLoading } from './AuthRouteLoading';

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === 'checking') return <AuthRouteLoading />;
  if (authStatus === 'authenticated') return <Navigate to="/" />;

  return children;
};
