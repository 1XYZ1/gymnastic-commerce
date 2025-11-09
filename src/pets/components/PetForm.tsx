import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { petFormSchema } from '../config';
import type { PetFormData } from '../config';
import type { Pet } from '../types';

interface PetFormProps {
  initialData?: Pet;
  onSubmit: (data: PetFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function PetForm({ initialData, onSubmit, onCancel, isLoading, submitLabel }: PetFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (initialData?.birthDate) {
      const date = initialData.birthDate instanceof Date
        ? initialData.birthDate
        : new Date(initialData.birthDate);
      return date;
    }
    return undefined;
  });

  const [behaviorNotes, setBehaviorNotes] = useState<string[]>(
    initialData?.behaviorNotes || []
  );
  const [currentNote, setCurrentNote] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<PetFormData>({
    resolver: yupResolver(petFormSchema) as any, // Type assertion para resolver incompatibilidad de Yup InferType
    defaultValues: initialData
      ? {
          name: initialData.name,
          species: initialData.species,
          breed: initialData.breed || undefined,
          birthDate:
            initialData.birthDate instanceof Date
              ? initialData.birthDate.toISOString().split('T')[0]
              : initialData.birthDate.split('T')[0],
          gender: initialData.gender,
          color: initialData.color || undefined,
          weight: initialData.weight ?? null,
          microchipNumber: initialData.microchipNumber || undefined,
          temperament: initialData.temperament || undefined,
          behaviorNotes: initialData.behaviorNotes || undefined,
          generalNotes: initialData.generalNotes || undefined,
        }
      : undefined,
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue('birthDate', date.toISOString().split('T')[0]);
    }
  };

  const addBehaviorNote = () => {
    if (currentNote.trim() && behaviorNotes.length < 5) {
      const updatedNotes = [...behaviorNotes, currentNote.trim()];
      setBehaviorNotes(updatedNotes);
      setValue('behaviorNotes', updatedNotes);
      setCurrentNote('');
    }
  };

  const removeBehaviorNote = (index: number) => {
    const updatedNotes = behaviorNotes.filter((_, i) => i !== index);
    setBehaviorNotes(updatedNotes);
    setValue('behaviorNotes', updatedNotes);
  };

  // Fecha máxima: hoy (no permitir fechas futuras)
  const maxDate = new Date();
  maxDate.setHours(23, 59, 59, 999);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm sm:text-base">Nombre *</Label>
        <Input id="name" {...register('name')} placeholder="Ej: Max" className="text-sm sm:text-base" />
        {errors.name && <p className="text-xs sm:text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Especie y Género en grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Especie */}
        <div className="space-y-2">
          <Label htmlFor="species" className="text-sm sm:text-base">Especie *</Label>
          <Controller
            name="species"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="species" className="cursor-pointer">
                  <SelectValue placeholder="Selecciona especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Perro</SelectItem>
                  <SelectItem value="cat">Gato</SelectItem>
                  <SelectItem value="bird">Ave</SelectItem>
                  <SelectItem value="rabbit">Conejo</SelectItem>
                  <SelectItem value="hamster">Hámster</SelectItem>
                  <SelectItem value="fish">Pez</SelectItem>
                  <SelectItem value="reptile">Reptil</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.species && <p className="text-xs sm:text-sm text-red-600">{errors.species.message}</p>}
        </div>

        {/* Género */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm sm:text-base">Género *</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="gender" className="cursor-pointer">
                  <SelectValue placeholder="Selecciona género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Macho</SelectItem>
                  <SelectItem value="female">Hembra</SelectItem>
                  <SelectItem value="unknown">Desconocido</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && <p className="text-xs sm:text-sm text-red-600">{errors.gender.message}</p>}
        </div>
      </div>

      {/* Raza y Fecha de Nacimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="breed" className="text-sm sm:text-base">Raza</Label>
          <Input id="breed" {...register('breed')} placeholder="Ej: Golden Retriever" className="text-sm sm:text-base" />
          {errors.breed && <p className="text-xs sm:text-sm text-red-600">{errors.breed.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-sm sm:text-base">Fecha de Nacimiento *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="birthDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-sm sm:text-base",
                  !selectedDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
          {errors.birthDate && <p className="text-xs sm:text-sm text-red-600">{errors.birthDate.message}</p>}
        </div>
      </div>

      {/* Color y Peso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm sm:text-base">Color</Label>
          <Input id="color" {...register('color')} placeholder="Ej: Dorado" className="text-sm sm:text-base" />
          {errors.color && <p className="text-xs sm:text-sm text-red-600">{errors.color.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm sm:text-base">Peso (kg)</Label>
          <Input id="weight" type="number" step="0.1" {...register('weight')} placeholder="Ej: 25.5" className="text-sm sm:text-base" />
          {errors.weight && <p className="text-xs sm:text-sm text-red-600">{errors.weight.message}</p>}
        </div>
      </div>

      {/* Microchip y Temperamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="microchipNumber" className="text-sm sm:text-base">
            Número de Microchip{' '}
            <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <Input
            id="microchipNumber"
            {...register('microchipNumber')}
            placeholder="15 dígitos"
            maxLength={15}
            className="text-sm sm:text-base"
          />
          {errors.microchipNumber && (
            <p className="text-xs sm:text-sm text-red-600">{errors.microchipNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperament" className="text-sm sm:text-base">Temperamento</Label>
          <Controller
            name="temperament"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="temperament" className="cursor-pointer">
                  <SelectValue placeholder="Selecciona temperamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Amigable</SelectItem>
                  <SelectItem value="aggressive">Agresivo</SelectItem>
                  <SelectItem value="shy">Tímido</SelectItem>
                  <SelectItem value="playful">Juguetón</SelectItem>
                  <SelectItem value="calm">Tranquilo</SelectItem>
                  <SelectItem value="energetic">Energético</SelectItem>
                  <SelectItem value="nervous">Nervioso</SelectItem>
                  <SelectItem value="unknown">Desconocido</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.temperament && <p className="text-xs sm:text-sm text-red-600">{errors.temperament.message}</p>}
        </div>
      </div>

      {/* Notas de Comportamiento */}
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="behavior-note-input" className="text-sm sm:text-base">
          Notas de Comportamiento{' '}
          <span className="text-xs text-muted-foreground font-normal">(opcional, máx. 5)</span>
        </Label>

        {/* Lista de notas actuales */}
        {behaviorNotes.length > 0 && (
          <div className="space-y-2">
            {behaviorNotes.map((note, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 sm:p-3 bg-muted rounded-md group"
              >
                <span className="text-primary mt-0.5 text-sm">•</span>
                <span className="flex-1 text-xs sm:text-sm">{note}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => removeBehaviorNote(index)}
                  aria-label={`Eliminar nota: ${note}`}
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input para agregar nueva nota */}
        {behaviorNotes.length < 5 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="behavior-note-input"
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Ej: Tiende a ladrar a extraños"
              maxLength={200}
              className="text-sm sm:text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBehaviorNote();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addBehaviorNote}
              disabled={!currentNote.trim()}
              className="w-full sm:w-auto text-sm"
            >
              Agregar
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Presiona Enter o haz clic en "Agregar" para añadir notas sobre el comportamiento
        </p>
      </div>

      {/* Notas Generales */}
      <div className="space-y-2">
        <Label htmlFor="generalNotes" className="text-sm sm:text-base">Notas Generales</Label>
        <Textarea
          id="generalNotes"
          {...register('generalNotes')}
          placeholder="Información adicional sobre la mascota..."
          rows={4}
          className="text-sm sm:text-base"
        />
        {errors.generalNotes && <p className="text-xs sm:text-sm text-red-600">{errors.generalNotes.message}</p>}
      </div>

      {/* Botones */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Guardando...' : submitLabel || (initialData ? 'Actualizar' : 'Crear Mascota')}
        </Button>
      </div>
    </form>
  );
}
