import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { MedicalRecord, CreateMedicalRecordDto } from '../types';
import type { VisitType } from '@/shared/types/enums';
import { VISIT_TYPE_LABELS, VETERINARY_HOURS } from '../config';
import { MedicalValidationService } from '../services';

interface MedicalRecordFormProps {
  initialData?: MedicalRecord;
  petId: string;
  onSubmit: (data: CreateMedicalRecordDto) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface FormData {
  visitDate: string;
  visitTime: string;
  visitType: VisitType;
  reason: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  weightAtVisit: string;
  temperature: string;
  serviceCost: string;
}

export function MedicalRecordForm({
  initialData,
  petId,
  onSubmit,
  onCancel,
  isLoading,
}: MedicalRecordFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (initialData?.visitDate) {
      const date = initialData.visitDate instanceof Date
        ? initialData.visitDate
        : new Date(initialData.visitDate);
      return date;
    }
    return undefined;
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormData>({
    defaultValues: initialData
      ? {
          visitDate: initialData.visitDate instanceof Date
            ? initialData.visitDate.toISOString().split('T')[0]
            : initialData.visitDate.split('T')[0],
          visitTime: initialData.visitDate instanceof Date
            ? format(initialData.visitDate, 'HH:mm')
            : new Date(initialData.visitDate).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              }),
          visitType: initialData.visitType,
          reason: initialData.reason,
          diagnosis: initialData.diagnosis || '',
          treatment: initialData.treatment || '',
          notes: initialData.notes || '',
          weightAtVisit: initialData.weightAtVisit?.toString() || '',
          temperature: initialData.temperature?.toString() || '',
          serviceCost: initialData.serviceCost?.toString() || '',
        }
      : {
          visitDate: '',
          visitTime: '09:00',
          visitType: 'consultation',
          reason: '',
          diagnosis: '',
          treatment: '',
          notes: '',
          weightAtVisit: '',
          temperature: '',
          serviceCost: '',
        },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue('visitDate', date.toISOString().split('T')[0]);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    setFormErrors([]);

    // Construir fecha y hora completa
    const dateTimeString = `${data.visitDate}T${data.visitTime}:00`;

    const dto: CreateMedicalRecordDto = {
      petId,
      visitDate: dateTimeString,
      visitType: data.visitType,
      reason: data.reason.trim(),
      diagnosis: data.diagnosis.trim() || undefined,
      treatment: data.treatment.trim() || undefined,
      notes: data.notes.trim() || undefined,
      weightAtVisit: data.weightAtVisit ? parseFloat(data.weightAtVisit) : undefined,
      temperature: data.temperature ? parseFloat(data.temperature) : undefined,
      serviceCost: data.serviceCost ? parseFloat(data.serviceCost) : undefined,
    };

    // Validación
    const validation = MedicalValidationService.validateCreateDto(dto);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    onSubmit(dto);
  };

  // Generar opciones de hora
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = VETERINARY_HOURS.start; hour < VETERINARY_HOURS.end; hour++) {
      for (let min = 0; min < 60; min += VETERINARY_HOURS.intervalMinutes) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Fecha máxima: hoy
  const maxDate = new Date();
  maxDate.setHours(23, 59, 59, 999);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Errores de validación */}
      {formErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-medium text-red-800 mb-2">Errores de validación:</p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 space-y-1">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Fecha y Hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="visitDate">Fecha de Visita *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="visitDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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
                onSelect={handleDateSelect}
                toDate={maxDate}
                locale={es}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.visitDate && <p className="text-sm text-red-600">{errors.visitDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="visitTime">Hora de Visita *</Label>
          <Controller
            name="visitTime"
            control={control}
            rules={{ required: 'La hora es requerida' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="visitTime">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Selecciona hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.visitTime && <p className="text-sm text-red-600">{errors.visitTime.message}</p>}
        </div>
      </div>

      {/* Tipo de Visita */}
      <div className="space-y-2">
        <Label htmlFor="visitType">Tipo de Visita *</Label>
        <Controller
          name="visitType"
          control={control}
          rules={{ required: 'El tipo de visita es requerido' }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="visitType">
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VISIT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.visitType && <p className="text-sm text-red-600">{errors.visitType.message}</p>}
      </div>

      {/* Razón */}
      <div className="space-y-2">
        <Label htmlFor="reason">Razón de la Visita *</Label>
        <Input
          id="reason"
          {...register('reason', { required: 'La razón es requerida' })}
          placeholder="Ej: Control de rutina, síntomas de enfermedad..."
        />
        {errors.reason && <p className="text-sm text-red-600">{errors.reason.message}</p>}
      </div>

      {/* Diagnóstico y Tratamiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnóstico</Label>
          <Textarea
            id="diagnosis"
            {...register('diagnosis')}
            placeholder="Diagnóstico realizado por el veterinario..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="treatment">Tratamiento</Label>
          <Textarea
            id="treatment"
            {...register('treatment')}
            placeholder="Tratamiento prescrito..."
            rows={3}
          />
        </div>
      </div>

      {/* Peso y Temperatura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weightAtVisit">Peso en la Visita (kg)</Label>
          <Input
            id="weightAtVisit"
            type="number"
            step="0.1"
            {...register('weightAtVisit')}
            placeholder="Ej: 25.5"
          />
          {errors.weightAtVisit && (
            <p className="text-sm text-red-600">{errors.weightAtVisit.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperatura (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            {...register('temperature')}
            placeholder="Ej: 38.5"
          />
          {errors.temperature && <p className="text-sm text-red-600">{errors.temperature.message}</p>}
        </div>
      </div>

      {/* Costo del Servicio */}
      <div className="space-y-2">
        <Label htmlFor="serviceCost">Costo del Servicio ($)</Label>
        <Input
          id="serviceCost"
          type="number"
          step="0.01"
          {...register('serviceCost')}
          placeholder="Ej: 1500.00"
        />
        {errors.serviceCost && <p className="text-sm text-red-600">{errors.serviceCost.message}</p>}
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notas Adicionales</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Observaciones adicionales..."
          rows={4}
        />
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="w-full sm:w-auto">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Registro' : 'Crear Registro'}
        </Button>
      </div>
    </form>
  );
}
