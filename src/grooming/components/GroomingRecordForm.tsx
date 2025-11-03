import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { GroomingRecord, CreateGroomingRecordDto } from '../types';
import {
  COMMON_GROOMING_SERVICES,
  COMMON_HAIR_STYLES,
  COMMON_PRODUCTS,
  SKIN_CONDITIONS,
  COAT_CONDITIONS,
  BEHAVIOR_OPTIONS,
  GROOMING_HOURS,
} from '../config';
import { GroomingValidationService } from '../services';

interface GroomingRecordFormProps {
  initialData?: GroomingRecord;
  petId: string;
  onSubmit: (data: CreateGroomingRecordDto) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface FormData {
  sessionDate: string;
  sessionTime: string;
  servicesPerformed: string[];
  hairStyle: string;
  productsUsed: string[];
  skinCondition: string;
  coatCondition: string;
  behaviorDuringSession: string;
  observations: string;
  recommendations: string;
  durationMinutes: string;
  serviceCost: string;
}

export function GroomingRecordForm({
  initialData,
  petId,
  onSubmit,
  onCancel,
  isLoading,
}: GroomingRecordFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (initialData?.sessionDate) {
      const date = initialData.sessionDate instanceof Date
        ? initialData.sessionDate
        : new Date(initialData.sessionDate);
      return date;
    }
    return undefined;
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Estado para servicios realizados
  const [services, setServices] = useState<string[]>(initialData?.servicesPerformed || []);
  const [currentService, setCurrentService] = useState('');

  // Estado para productos usados
  const [products, setProducts] = useState<string[]>(initialData?.productsUsed || []);
  const [currentProduct, setCurrentProduct] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormData>({
    defaultValues: initialData
      ? {
          sessionDate: initialData.sessionDate instanceof Date
            ? initialData.sessionDate.toISOString().split('T')[0]
            : initialData.sessionDate.split('T')[0],
          sessionTime: initialData.sessionDate instanceof Date
            ? format(initialData.sessionDate, 'HH:mm')
            : new Date(initialData.sessionDate).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              }),
          servicesPerformed: initialData.servicesPerformed,
          hairStyle: initialData.hairStyle || '',
          productsUsed: initialData.productsUsed || [],
          skinCondition: initialData.skinCondition || '',
          coatCondition: initialData.coatCondition || '',
          behaviorDuringSession: initialData.behaviorDuringSession || '',
          observations: initialData.observations || '',
          recommendations: initialData.recommendations || '',
          durationMinutes: initialData.durationMinutes.toString(),
          serviceCost: initialData.serviceCost?.toString() || '',
        }
      : {
          sessionDate: '',
          sessionTime: '09:00',
          servicesPerformed: [],
          hairStyle: '',
          productsUsed: [],
          skinCondition: '',
          coatCondition: '',
          behaviorDuringSession: '',
          observations: '',
          recommendations: '',
          durationMinutes: '',
          serviceCost: '',
        },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue('sessionDate', date.toISOString().split('T')[0]);
    }
  };

  // Agregar servicio
  const addService = () => {
    if (currentService.trim() && services.length < 10) {
      const updatedServices = [...services, currentService.trim()];
      setServices(updatedServices);
      setValue('servicesPerformed', updatedServices);
      setCurrentService('');
    }
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    setValue('servicesPerformed', updatedServices);
  };

  // Agregar producto
  const addProduct = () => {
    if (currentProduct.trim() && products.length < 10) {
      const updatedProducts = [...products, currentProduct.trim()];
      setProducts(updatedProducts);
      setValue('productsUsed', updatedProducts);
      setCurrentProduct('');
    }
  };

  const removeProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    setValue('productsUsed', updatedProducts);
  };

  const handleFormSubmit = (data: FormData) => {
    setFormErrors([]);

    // Validación: Al menos un servicio debe estar agregado
    if (services.length === 0) {
      setFormErrors(['Debe agregar al menos un servicio realizado']);
      return;
    }

    // Validación: Fecha debe estar seleccionada
    if (!data.sessionDate) {
      setFormErrors(['Debe seleccionar una fecha de sesión']);
      return;
    }

    // Validación: Duración debe ser un número válido
    const durationNum = parseInt(data.durationMinutes);
    if (isNaN(durationNum) || durationNum <= 0) {
      setFormErrors(['La duración debe ser un número válido mayor a 0']);
      return;
    }

    // Validación: Costo debe ser un número válido si está presente
    let serviceCostNum: number | undefined = undefined;
    if (data.serviceCost && data.serviceCost.trim() !== '') {
      serviceCostNum = parseFloat(data.serviceCost);
      if (isNaN(serviceCostNum)) {
        setFormErrors(['El costo del servicio debe ser un número válido']);
        return;
      }
    }

    // Construir fecha y hora completa
    const dateTimeString = `${data.sessionDate}T${data.sessionTime}:00`;

    const dto: CreateGroomingRecordDto = {
      petId,
      sessionDate: dateTimeString,
      servicesPerformed: services,
      hairStyle: data.hairStyle?.trim() || undefined,
      productsUsed: products.length > 0 ? products : undefined,
      skinCondition: data.skinCondition || undefined,
      coatCondition: data.coatCondition || undefined,
      behaviorDuringSession: data.behaviorDuringSession || undefined,
      observations: data.observations?.trim() || undefined,
      recommendations: data.recommendations?.trim() || undefined,
      durationMinutes: durationNum,
      serviceCost: serviceCostNum,
    };

    // Validación final con servicio de validación
    const validation = GroomingValidationService.validateCreateDto(dto);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    onSubmit(dto);
  };

  // Generar opciones de hora
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = GROOMING_HOURS.start; hour < GROOMING_HOURS.end; hour++) {
      for (let min = 0; min < 60; min += GROOMING_HOURS.intervalMinutes) {
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sessionDate" className="text-xs sm:text-sm">Fecha de Sesión *</Label>
          <input
            type="hidden"
            {...register('sessionDate', { required: 'La fecha de sesión es requerida' })}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="sessionDate"
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
          {errors.sessionDate && <p className="text-sm text-red-600">{errors.sessionDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionTime" className="text-xs sm:text-sm">Hora de Sesión *</Label>
          <Controller
            name="sessionTime"
            control={control}
            rules={{ required: 'La hora es requerida' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="sessionTime">
                  <Clock className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
          {errors.sessionTime && <p className="text-xs sm:text-sm text-red-600">{errors.sessionTime.message}</p>}
        </div>
      </div>

      {/* Servicios Realizados */}
      <div className="space-y-2">
        <Label htmlFor="service-input" className="text-xs sm:text-sm">Servicios Realizados *</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              id="service-input"
              list="services-list"
              value={currentService}
              onChange={(e) => setCurrentService(e.target.value)}
              placeholder="Ej: Baño, Corte, Corte de uñas..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addService();
                }
              }}
              disabled={services.length >= 10}
            />
            <datalist id="services-list">
              {COMMON_GROOMING_SERVICES.map((service) => (
                <option key={service} value={service} />
              ))}
            </datalist>
          </div>
          <Button
            type="button"
            onClick={addService}
            disabled={!currentService.trim() || services.length >= 10}
            size="icon"
            className="w-full sm:w-auto"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        {services.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {services.map((service, index) => (
              <Badge key={index} variant="secondary" className="gap-1 text-xs">
                {service}
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="ml-1 hover:bg-red-100 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {services.length}/10 servicios agregados
        </p>
      </div>

      {/* Estilo de Corte */}
      <div className="space-y-2">
        <Label htmlFor="hairStyle" className="text-xs sm:text-sm">Estilo de Corte</Label>
        <Input
          id="hairStyle"
          list="hairstyles-list"
          {...register('hairStyle')}
          placeholder="Ej: Corte verano, Corte de raza..."
        />
        <datalist id="hairstyles-list">
          {COMMON_HAIR_STYLES.map((style) => (
            <option key={style} value={style} />
          ))}
        </datalist>
      </div>

      {/* Productos Usados */}
      <div className="space-y-2">
        <Label htmlFor="product-input" className="text-xs sm:text-sm">Productos Usados</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              id="product-input"
              list="products-list"
              value={currentProduct}
              onChange={(e) => setCurrentProduct(e.target.value)}
              placeholder="Ej: Shampoo hipoalergénico, Acondicionador..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addProduct();
                }
              }}
              disabled={products.length >= 10}
            />
            <datalist id="products-list">
              {COMMON_PRODUCTS.map((product) => (
                <option key={product} value={product} />
              ))}
            </datalist>
          </div>
          <Button
            type="button"
            onClick={addProduct}
            disabled={!currentProduct.trim() || products.length >= 10}
            size="icon"
            className="w-full sm:w-auto"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        {products.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {products.map((product, index) => (
              <Badge key={index} variant="outline" className="gap-1 text-xs">
                {product}
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="ml-1 hover:bg-red-100 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {products.length}/10 productos agregados
        </p>
      </div>

      {/* Condiciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="skinCondition" className="text-xs sm:text-sm">Condición de Piel</Label>
          <Controller
            name="skinCondition"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="skinCondition">
                  <SelectValue placeholder="Selecciona condición (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {SKIN_CONDITIONS.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coatCondition" className="text-xs sm:text-sm">Condición de Pelaje</Label>
          <Controller
            name="coatCondition"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="coatCondition">
                  <SelectValue placeholder="Selecciona condición (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {COAT_CONDITIONS.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Comportamiento */}
      <div className="space-y-2">
        <Label htmlFor="behaviorDuringSession" className="text-xs sm:text-sm">Comportamiento Durante Sesión</Label>
        <Controller
          name="behaviorDuringSession"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="behaviorDuringSession">
                <SelectValue placeholder="Selecciona comportamiento (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {BEHAVIOR_OPTIONS.map((behavior) => (
                  <SelectItem key={behavior} value={behavior}>
                    {behavior}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Observaciones y Recomendaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="observations" className="text-xs sm:text-sm">Observaciones</Label>
          <Textarea
            id="observations"
            {...register('observations')}
            placeholder="Observaciones durante la sesión..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommendations" className="text-xs sm:text-sm">Recomendaciones</Label>
          <Textarea
            id="recommendations"
            {...register('recommendations')}
            placeholder="Recomendaciones para el cuidado..."
            rows={3}
          />
        </div>
      </div>

      {/* Duración y Costo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="durationMinutes" className="text-xs sm:text-sm">Duración (minutos) *</Label>
          <Input
            id="durationMinutes"
            type="number"
            min="1"
            max="480"
            {...register('durationMinutes', { required: 'La duración es requerida' })}
            placeholder="Ej: 60"
          />
          {errors.durationMinutes && (
            <p className="text-xs sm:text-sm text-red-600">{errors.durationMinutes.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceCost" className="text-xs sm:text-sm">Costo del Servicio ($)</Label>
          <Input
            id="serviceCost"
            type="number"
            step="0.01"
            min="0"
            {...register('serviceCost')}
            placeholder="Ej: 500.00"
          />
          {errors.serviceCost && <p className="text-xs sm:text-sm text-red-600">{errors.serviceCost.message}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="w-full sm:w-auto order-2 sm:order-1">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto order-1 sm:order-2">
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Registro' : 'Crear Registro'}
        </Button>
      </div>
    </form>
  );
}
