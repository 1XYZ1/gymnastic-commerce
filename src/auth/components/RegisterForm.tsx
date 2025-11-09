/**
 * Componente de formulario de registro
 *
 * Usa React Hook Form con validación Zod
 * Maneja el registro de nuevos usuarios con validación completa
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { registerSchema, type RegisterFormData } from '../schemas/register.schema';
import { PASSWORD_MIN_LENGTH } from '../constants';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading = false }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur', // Validar cuando el usuario sale del campo
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      {/* Full Name field */}
      <div className="grid gap-2">
        <Label htmlFor="fullName">
          Nombre completo
          <span className="text-destructive"> *</span>
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Juan Pérez"
          {...register('fullName')}
          disabled={isLoading}
          aria-invalid={errors.fullName ? 'true' : 'false'}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive" role="alert">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="grid gap-2">
        <Label htmlFor="email">
          Correo electrónico
          <span className="text-destructive"> *</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          {...register('email')}
          disabled={isLoading}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="grid gap-2">
        <Label htmlFor="password">
          Contraseña
          <span className="text-destructive"> *</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          disabled={isLoading}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Mínimo {PASSWORD_MIN_LENGTH} caracteres: una mayúscula, una minúscula, y un número o carácter especial
        </p>
      </div>

      {/* Confirm Password field */}
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">
          Confirmar contraseña
          <span className="text-destructive"> *</span>
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          disabled={isLoading}
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  );
};
