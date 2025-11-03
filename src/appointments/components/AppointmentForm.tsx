import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useServices } from '@/services/hooks/useServices';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';
import { AppointmentValidationService } from '../services/AppointmentValidationService';
import { useAppointmentMutations } from '../hooks/useAppointmentMutations';
import { AppointmentPetSelector } from './AppointmentPetSelector';
import type { CreateAppointmentDTO } from '../types/appointment.types';

interface AppointmentFormProps {
  preselectedServiceId?: string;
  onSuccess?: () => void;
}

// Horarios disponibles (9 AM - 6 PM)
const AVAILABLE_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

/**
 * Formulario mejorado para crear una nueva cita
 * Incluye selector visual de servicios y calendario shadcn/ui
 */
export function AppointmentForm({ preselectedServiceId, onSuccess }: AppointmentFormProps) {
  const { data: servicesResponse, isLoading: isLoadingServices } = useServices({ limit: 100 });
  const { createAppointment } = useAppointmentMutations();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateAppointmentDTO>({
    defaultValues: {
      serviceId: preselectedServiceId || '',
      date: '',
      petId: '',
      notes: '',
    },
  });

  const selectedServiceId = watch('serviceId');
  const selectedPetId = watch('petId');

  const onSubmit = (data: CreateAppointmentDTO) => {
    // Combinar fecha y hora seleccionadas
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y hora');
      return;
    }

    const [hours, minutes] = selectedTime.split(':');
    const dateTime = new Date(selectedDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    const isoDateTime = dateTime.toISOString().slice(0, 16);

    // Validar fecha antes de enviar
    const validation = AppointmentValidationService.validateAppointmentDate(isoDateTime);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    createAppointment.mutate(
      { ...data, date: isoDateTime },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  // Fecha mínima: mañana
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);

  // Deshabilitar domingos
  const disabledDays = (date: Date) => {
    return date.getDay() === 0; // 0 = Domingo
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
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No hay servicios disponibles</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No hay servicios disponibles para agendar citas en este momento. Por favor, contacta con nosotros.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Información de horarios */}
      <div className="rounded-lg border bg-primary/5 p-4">
        <div className="flex gap-3">
          <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Horario de atención</p>
            <p className="text-xs text-muted-foreground">
              Lunes a Sábado: 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Selector de servicio con Radio Group */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">
          Selecciona un servicio <span className="text-destructive">*</span>
        </Label>

        <RadioGroup
          value={selectedServiceId}
          onValueChange={(value) => setValue('serviceId', value)}
          className="grid gap-3 sm:grid-cols-2"
        >
          {services.map((service) => (
            <div key={service.id}>
              <RadioGroupItem
                value={service.id}
                id={service.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={service.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all",
                  "hover:bg-accent hover:border-primary/50",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-tight">{service.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  {service.image && (
                    <img
                      src={service.image}
                      alt=""
                      className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-1 rounded-md bg-muted font-medium">
                    {SERVICE_TYPE_LABELS[service.type]}
                  </span>
                  <span className="font-bold text-sm">${service.price}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span>{service.durationMinutes} min</span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {errors.serviceId && (
          <p className="text-sm text-destructive flex items-center gap-1" role="alert">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            {errors.serviceId.message}
          </p>
        )}
      </div>

      {/* Fecha y hora con Calendar de shadcn */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">
          Fecha y hora <span className="text-destructive">*</span>
        </Label>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Selector de fecha */}
          <div className="space-y-2">
            <Label htmlFor="date-picker" className="text-sm">Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11",
                    !selectedDate && "text-muted-foreground"
                  )}
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disabledDays}
                  fromDate={minDate}
                  locale={es}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Selector de hora */}
          <div className="space-y-2">
            <Label htmlFor="time-select" className="text-sm">Hora</Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              disabled={!selectedDate}
            >
              <SelectTrigger
                id="time-select"
                className="h-11"
                aria-label="Seleccionar hora"
              >
                <SelectValue placeholder="Selecciona una hora" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_HOURS.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedDate && selectedTime && (
          <p className="text-sm text-muted-foreground flex items-center gap-2 p-3 bg-muted/50 rounded-md">
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            Cita agendada para: {format(selectedDate, "PPP", { locale: es })} a las {selectedTime}
          </p>
        )}
      </div>

      {/* Selector de mascota */}
      <Controller
        name="petId"
        control={control}
        rules={{ required: 'Debes seleccionar una mascota' }}
        render={({ field, fieldState }) => (
          <AppointmentPetSelector
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      {/* Notas adicionales (opcional) */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notas adicionales <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Información sobre alergias, comportamiento, condiciones especiales, etc."
          rows={4}
          className="resize-none"
          {...register('notes')}
        />
        <p className="text-xs text-muted-foreground">
          Comparte cualquier información que consideres relevante para el servicio
        </p>
      </div>

      {/* Botón de envío */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold"
          disabled={createAppointment.isPending || !selectedServiceId || !selectedPetId || !selectedDate || !selectedTime}
        >
          {createAppointment.isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
              Agendando cita...
            </>
          ) : (
            <>
              <CalendarIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              Confirmar y agendar cita
            </>
          )}
        </Button>
        {(!selectedServiceId || !selectedPetId || !selectedDate || !selectedTime) && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Completa todos los campos requeridos para continuar
          </p>
        )}
      </div>
    </form>
  );
}
