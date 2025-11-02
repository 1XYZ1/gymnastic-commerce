import { type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AuthFormLayout } from '@/auth/components/AuthFormLayout';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();

  // Obtener returnUrl de los query params
  const returnUrl = searchParams.get('returnUrl') || '/';

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implementar lógica de registro
    console.log('Registro pendiente de implementación');
    console.log('ReturnUrl:', returnUrl);
  };

  return (
    <AuthFormLayout description="Crea una nueva cuenta">
      <form onSubmit={handleRegister} className="contents">
        {/* Full name field */}
        <div className="grid gap-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Nombre completo"
            required
          />
        </div>

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
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            placeholder="Contraseña"
          />
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full">
          Crear cuenta
        </Button>

        {/* Login link */}
        <div className="text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link
            to={returnUrl !== '/' ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/auth/login'}
            className="underline underline-offset-4"
          >
            Ingresa ahora
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};
