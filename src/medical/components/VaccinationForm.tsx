import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Vaccination, CreateVaccinationDto } from '../types';
import { COMMON_VACCINES } from '../config';
import { MedicalValidationService } from '../services';

interface VaccinationFormProps {
  initialData?: Vaccination;
  petId: string;
  onSubmit: (data: CreateVaccinationDto) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface FormData {
  vaccineName: string;
  administeredDate: string;
  nextDueDate: string;
  batchNumber: string;
  notes: string;
}

export function VaccinationForm({
  initialData,
  petId,
  onSubmit,
  onCancel,
  isLoading,
}: VaccinationFormProps) {
  const [selectedAdminDate, setSelectedAdminDate] = useState<Date | undefined>(() => {
    if (initialData?.administeredDate) {
      const date = initialData.administeredDate instanceof Date
        ? initialData.administeredDate
        : new Date(initialData.administeredDate);
      return date;
    }
    return undefined;
  });

  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>(() => {
    if (initialData?.nextDueDate) {
      const date = initialData.nextDueDate instanceof Date
        ? initialData.nextDueDate
        : new Date(initialData.nextDueDate);
      return date;
    }
    return undefined;
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: initialData
      ? {
          vaccineName: initialData.vaccineName,
          administeredDate: initialData.administeredDate instanceof Date
            ? initialData.administeredDate.toISOString().split('T')[0]
            : initialData.administeredDate.split('T')[0],
          nextDueDate: initialData.nextDueDate
            ? initialData.nextDueDate instanceof Date
              ? initialData.nextDueDate.toISOString().split('T')[0]
              : initialData.nextDueDate.split('T')[0]
            : '',
          batchNumber: initialData.batchNumber || '',
          notes: initialData.notes || '',
        }
      : {
          vaccineName: '',
          administeredDate: '',
          nextDueDate: '',
          batchNumber: '',
          notes: '',
        },
  });

  const vaccineName = watch('vaccineName');

  const handleAdminDateSelect = (date: Date | undefined) => {
    setSelectedAdminDate(date);
    if (date) {
      setValue('administeredDate', date.toISOString().split('T')[0]);
    }
  };

  const handleDueDateSelect = (date: Date | undefined) => {
    setSelectedDueDate(date);
    if (date) {
      setValue('nextDueDate', date.toISOString().split('T')[0]);
    } else {
      setValue('nextDueDate', '');
    }
  };

  const handleFormSubmit = (data: FormData) => {
    setFormErrors([]);

    const dto: CreateVaccinationDto = {
      petId,
      vaccineName: data.vaccineName.trim(),
      administeredDate: data.administeredDate,
      nextDueDate: data.nextDueDate || undefined,
      batchNumber: data.batchNumber.trim() || undefined,
      notes: data.notes.trim() || undefined,
    };

    // Validación
    const validation = MedicalValidationService.validateVaccinationDto(dto);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    onSubmit(dto);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue('vaccineName', suggestion);
    setShowSuggestions(false);
  };

  // Filtrar sugerencias basadas en el input
  const filteredSuggestions = vaccineName
    ? COMMON_VACCINES.filter((vaccine) =>
        vaccine.toLowerCase().includes(vaccineName.toLowerCase())
      )
    : COMMON_VACCINES;

  // Fecha máxima para administeredDate: hoy
  const maxAdminDate = new Date();
  maxAdminDate.setHours(23, 59, 59, 999);

  // Fecha mínima para nextDueDate: administeredDate + 1 día
  const minDueDate = selectedAdminDate
    ? new Date(selectedAdminDate.getTime() + 24 * 60 * 60 * 1000)
    : undefined;

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

      {/* Nombre de la Vacuna */}
      <div className="space-y-2">
        <Label htmlFor="vaccineName">Nombre de la Vacuna *</Label>
        <div className="relative">
          <Input
            id="vaccineName"
            {...register('vaccineName', { required: 'El nombre de la vacuna es requerido' })}
            placeholder="Ej: Antirrábica"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay para permitir clicks en sugerencias
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />
          {errors.vaccineName && (
            <p className="text-sm text-red-600">{errors.vaccineName.message}</p>
          )}

          {/* Sugerencias */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2">
                <p className="text-xs text-muted-foreground mb-2">Vacunas comunes:</p>
                <div className="space-y-1">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="administeredDate">Fecha de Administración *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="administeredDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedAdminDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedAdminDate ? (
                  format(selectedAdminDate, "PPP", { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedAdminDate}
                onSelect={handleAdminDateSelect}
                toDate={maxAdminDate}
                locale={es}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.administeredDate && (
            <p className="text-sm text-red-600">{errors.administeredDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextDueDate">
            Próxima Fecha{' '}
            <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="nextDueDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDueDate && "text-muted-foreground"
                )}
                type="button"
                disabled={!selectedAdminDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDueDate ? (
                  format(selectedDueDate, "PPP", { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDueDate}
                onSelect={handleDueDateSelect}
                fromDate={minDueDate}
                locale={es}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {!selectedAdminDate && (
            <p className="text-xs text-muted-foreground">
              Primero selecciona la fecha de administración
            </p>
          )}
          {errors.nextDueDate && <p className="text-sm text-red-600">{errors.nextDueDate.message}</p>}
        </div>
      </div>

      {/* Número de Lote */}
      <div className="space-y-2">
        <Label htmlFor="batchNumber">
          Número de Lote{' '}
          <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="batchNumber"
          {...register('batchNumber')}
          placeholder="Ej: LOT123456"
          className="font-mono"
        />
        {errors.batchNumber && <p className="text-sm text-red-600">{errors.batchNumber.message}</p>}
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notas Adicionales</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Observaciones sobre la vacuna, reacciones, etc..."
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
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Vacuna' : 'Registrar Vacuna'}
        </Button>
      </div>
    </form>
  );
}
