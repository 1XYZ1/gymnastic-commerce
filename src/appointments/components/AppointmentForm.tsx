import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useServices } from '@/services/hooks/useServices';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';
import { AppointmentValidationService } from '../services/AppointmentValidationService';
import { useAppointmentMutations } from '../hooks/useAppointmentMutations';
import type { CreateAppointmentDTO } from '../types/appointment.types';

interface AppointmentFormProps {
  preselectedServiceId?: string;
  onSuccess?: () => void;
}

/**
 * Formulario para crear una nueva cita
 * Incluye validaciones de fecha/hora según horario de atención
 */
export function AppointmentForm({ preselectedServiceId, onSuccess }: AppointmentFormProps) {
  const { data: servicesResponse, isLoading: isLoadingServices } = useServices({ limit: 100 });
  const { createAppointment } = useAppointmentMutations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAppointmentDTO>({
    defaultValues: {
      serviceId: preselectedServiceId || '',
      date: '',
      petName: '',
      petBreed: '',
      notes: '',
    },
  });

  const selectedServiceId = watch('serviceId');

  const onSubmit = (data: CreateAppointmentDTO) => {
    // Validar fecha antes de enviar
    const validation = AppointmentValidationService.validateAppointmentDate(data.date);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    createAppointment.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  // Obtener fecha mínima (ahora + 1 hora)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  if (isLoadingServices) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
        <p className="text-sm text-muted-foreground">Cargando servicios disponibles...</p>
      </div>
    );
  }

  const services = servicesResponse?.data || [];

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div
          className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl mb-4"
          aria-hidden="true"
        >
          ℹ️
        </div>
        <h3 className="text-lg font-semibold mb-2">No hay servicios disponibles</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No hay servicios disponibles para agendar citas en este momento. Por favor, contacta con nosotros.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información de horarios */}
      <div className="rounded-lg border bg-muted/30 p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-muted-foreground mt-0.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Horario de atención</p>
            <p className="text-xs text-muted-foreground">
              Lunes a Sábado: 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Selector de servicio */}
      <div className="space-y-2">
        <Label htmlFor="service" className="text-sm font-medium">
          Servicio <span className="text-destructive" aria-label="requerido">*</span>
        </Label>
        <Select
          value={selectedServiceId}
          onValueChange={(value) => setValue('serviceId', value)}
          required
        >
          <SelectTrigger
            id="service"
            className={errors.serviceId ? 'border-destructive focus-visible:ring-destructive' : ''}
            aria-label="Seleccionar servicio"
            aria-invalid={errors.serviceId ? 'true' : 'false'}
            aria-describedby={errors.serviceId ? 'service-error' : 'service-helper'}
          >
            <SelectValue placeholder="Selecciona un servicio" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                <div className="flex items-center justify-between gap-4 w-full">
                  <span>{service.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {SERVICE_TYPE_LABELS[service.type]} - ${service.price}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.serviceId && (
          <p className="text-sm text-destructive flex items-center gap-1" id="service-error" role="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.serviceId.message}
          </p>
        )}
      </div>

      {/* Fecha y hora */}
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium">
          Fecha y hora <span className="text-destructive" aria-label="requerido">*</span>
        </Label>
        <Input
          id="date"
          type="datetime-local"
          min={getMinDateTime()}
          className={errors.date ? 'border-destructive focus-visible:ring-destructive' : ''}
          {...register('date', {
            required: 'La fecha es requerida',
            validate: (value) => {
              const validation = AppointmentValidationService.validateAppointmentDate(value);
              return validation.valid || validation.error;
            },
          })}
          aria-invalid={errors.date ? 'true' : 'false'}
          aria-describedby={errors.date ? 'date-error' : 'date-helper'}
        />
        {errors.date && (
          <p className="text-sm text-destructive flex items-center gap-1" id="date-error" role="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.date.message}
          </p>
        )}
        {!errors.date && (
          <p id="date-helper" className="text-xs text-muted-foreground">
            Selecciona una fecha dentro del horario de atención
          </p>
        )}
      </div>

      {/* Información de la mascota */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <circle cx="11" cy="4" r="2" />
            <circle cx="18" cy="8" r="2" />
            <circle cx="20" cy="16" r="2" />
            <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
          </svg>
          Información de tu mascota
        </h3>

        {/* Nombre de la mascota */}
        <div className="space-y-2">
          <Label htmlFor="petName" className="text-sm font-medium">
            Nombre <span className="text-destructive" aria-label="requerido">*</span>
          </Label>
          <Input
            id="petName"
            type="text"
            placeholder="Ej: Max"
            className={errors.petName ? 'border-destructive focus-visible:ring-destructive' : ''}
            {...register('petName', {
              required: 'El nombre de la mascota es requerido',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres',
              },
            })}
            aria-invalid={errors.petName ? 'true' : 'false'}
            aria-describedby={errors.petName ? 'petName-error' : undefined}
          />
          {errors.petName && (
            <p className="text-sm text-destructive flex items-center gap-1" id="petName-error" role="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.petName.message}
            </p>
          )}
        </div>

        {/* Raza (opcional) */}
        <div className="space-y-2">
          <Label htmlFor="petBreed" className="text-sm font-medium">
            Raza <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <Input
            id="petBreed"
            type="text"
            placeholder="Ej: Golden Retriever"
            {...register('petBreed')}
            aria-describedby="petBreed-helper"
          />
          <p id="petBreed-helper" className="text-xs text-muted-foreground">
            Ayuda a brindar un mejor servicio personalizado
          </p>
        </div>
      </div>

      {/* Notas adicionales (opcional) */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notas adicionales <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Información adicional sobre tu mascota, condiciones especiales, alergias, comportamiento, etc."
          rows={4}
          className="resize-none"
          {...register('notes')}
          aria-describedby="notes-helper"
        />
        <p id="notes-helper" className="text-xs text-muted-foreground">
          Comparte cualquier información que consideres relevante
        </p>
      </div>

      {/* Botón de envío */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={createAppointment.isPending}
        >
          {createAppointment.isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Agendando cita...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Agendar cita
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
