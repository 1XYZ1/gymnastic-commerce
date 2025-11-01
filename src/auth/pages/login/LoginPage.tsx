import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuthStore } from '@/auth/store/auth.store';
import { AuthFormLayout } from '@/auth/components/AuthFormLayout';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const isValid = await login(email, password);

    if (isValid) {
      navigate('/');
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
          <Link to="/auth/register" className="underline underline-offset-4">
            Crea una
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};
