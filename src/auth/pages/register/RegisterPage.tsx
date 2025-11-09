/**
 * Página de registro de nuevos usuarios
 *
 * Flujo:
 * 1. Usuario completa formulario con validación Zod
 * 2. Envío a backend mediante authStore.register()
 * 3. Si exitoso: sincroniza carrito guest (si existe) y redirige
 * 4. Si error: muestra toast con mensaje user-friendly
 */

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { AuthFormLayout } from '@/auth/components/AuthFormLayout';
import { RegisterForm } from '@/auth/components/RegisterForm';
import { useAuthStore } from '@/auth/store/auth.store';
import { useCartMutations } from '@/cart/hooks/useCartMutations';
import { GuestCartStorageService } from '@/cart/services/GuestCartStorageService';

import type { RegisterFormData } from '@/auth/schemas/register.schema';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuthStore();
  const { syncCart } = useCartMutations();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener returnUrl de los query params
  const returnUrl = searchParams.get('returnUrl') || '/';

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);

    // Llamar al store para registrar (excluye confirmPassword)
    const result = await register(data.fullName, data.email, data.password);

    if (result.success) {
      // Registro exitoso
      toast.success('Cuenta creada exitosamente. ¡Bienvenido!');

      // Sincronizar carrito guest si existe
      const guestItems = GuestCartStorageService.getItems();
      if (guestItems.length > 0) {
        syncCart.mutate({ items: guestItems });
      }

      // Redirigir al returnUrl o home
      navigate(returnUrl);
    } else {
      // Error en registro (email duplicado, error de red, etc.)
      toast.error(result.error || 'No se pudo crear la cuenta. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout description="Crea una nueva cuenta">
      {/* Formulario de registro */}
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

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
    </AuthFormLayout>
  );
};
