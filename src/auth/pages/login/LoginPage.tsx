import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuthStore } from '@/auth/store/auth.store';
import { AuthFormLayout } from '@/auth/components/AuthFormLayout';
import { useCartMutations } from '@/cart/hooks/useCartMutations';
import { GuestCartStorageService } from '@/cart/services/GuestCartStorageService';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const { syncCart } = useCartMutations();
  const [isPosting, setIsPosting] = useState(false);

  // Obtener returnUrl de los query params
  const returnUrl = searchParams.get('returnUrl') || '/';

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const isValid = await login(email, password);

    if (isValid) {
      // Check if there are items in guest cart to sync
      const guestItems = GuestCartStorageService.getItems();

      if (guestItems.length > 0) {
        // Sync guest cart with backend
        syncCart.mutate({ items: guestItems });
      }

      // Redirigir al returnUrl si existe, sino a home
      navigate(returnUrl);
      return;
    }

    toast.error('Correo o/y contraseña no validos');
    setIsPosting(false);
  };

  return (
    <AuthFormLayout description="Ingrese a nuestra aplicación">
      <form onSubmit={handleLogin} className="contents">
        {/* Email field */}
        <div className="grid gap-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="mail@google.com"
            required
          />
        </div>

        {/* Password field */}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              to="/auth/forgot-password"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            placeholder="Contraseña"
          />
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isPosting}>
          Ingresar
        </Button>

        {/* Register link */}
        <div className="text-center text-sm">
          ¿No tienes cuenta?{' '}
          <Link
            to={returnUrl !== '/' ? `/auth/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/auth/register'}
            className="underline underline-offset-4"
          >
            Crea una
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};
