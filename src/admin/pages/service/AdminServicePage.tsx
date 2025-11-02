import { Navigate, useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { Trash2Icon } from 'lucide-react';
import { AdminTitle } from '@/admin/components/AdminTitle';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useService } from '@/services/hooks/useService';
import { useServiceMutations } from '@/admin/hooks/useServiceMutations';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';
import type { ServiceFormInputs } from '@/admin/types/service-admin.types';

/**
 * Página CRUD de servicio individual
 * Permite crear, editar y eliminar servicios
 */
export const AdminServicePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = id === 'new';

  // Solo ejecutar query si no es nuevo
  const { data: service, isLoading, isError } = useService(isNew ? '' : id ?? '');

  const { createService, updateService, deleteService } = useServiceMutations();

  // Configurar valores por defecto del formulario
  const defaultValues: ServiceFormInputs = isNew
    ? {
        name: '',
        description: '',
        price: 0,
        durationMinutes: 30,
        type: 'grooming',
        image: '',
        isActive: true,
      }
    : {
        name: service?.name ?? '',
        description: service?.description ?? '',
        price: service?.price ?? 0,
        durationMinutes: service?.durationMinutes ?? 30,
        type: service?.type ?? 'grooming',
        image: service?.image ?? '',
        isActive: service?.isActive ?? true,
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ServiceFormInputs>({
    defaultValues,
    values: !isNew && service ? defaultValues : undefined,
  });

  const selectedType = watch('type');
  const isActive = watch('isActive');

  // Handler para submit del formulario
  const onSubmit = async (data: ServiceFormInputs) => {
    if (isNew) {
      // Crear nuevo servicio
      const { isActive: _, ...createData } = data;
      createService.mutate(createData, {
        onSuccess: (newService) => {
          navigate(`/admin/services/${newService.id}`);
        },
      });
    } else {
      // Actualizar servicio existente
      updateService.mutate(
        { id: id!, data },
        {
          onSuccess: () => {
            // Mantener en la misma página después de actualizar
          },
        }
      );
    }
  };

  // Handler para eliminar
  const handleDelete = () => {
    if (!id || isNew) return;
    deleteService.mutate(id, {
      onSuccess: () => {
        navigate('/admin/services');
      },
    });
  };

  // Estados de carga y error
  if (isLoading && !isNew) {
    return <CustomFullScreenLoading />;
  }

  if ((isError || !service) && !isNew) {
    return <Navigate to="/admin/services" />;
  }

  const title = isNew ? 'Nuevo servicio' : 'Editar servicio';
  const subtitle = isNew
    ? 'Aquí puedes crear un nuevo servicio.'
    : 'Aquí puedes editar el servicio.';

  const isPending = createService.isPending || updateService.isPending || deleteService.isPending;

  return (
    <div>
      <AdminTitle title={title} subtitle={subtitle} />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl bg-white p-8 rounded-lg shadow">
        <div className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre del servicio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name', {
                required: 'El nombre es requerido',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              })}
              placeholder="Ej: Baño y corte"
              disabled={isPending}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register('description', {
                required: 'La descripción es requerida',
                minLength: { value: 10, message: 'Mínimo 10 caracteres' },
              })}
              placeholder="Describe el servicio en detalle..."
              rows={4}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Grid de 2 columnas para Precio y Duración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Precio */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Precio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'El precio es requerido',
                  min: { value: 0, message: 'El precio no puede ser negativo' },
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                disabled={isPending}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            {/* Duración */}
            <div className="space-y-2">
              <Label htmlFor="durationMinutes">
                Duración (minutos) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="durationMinutes"
                type="number"
                {...register('durationMinutes', {
                  required: 'La duración es requerida',
                  min: { value: 1, message: 'Mínimo 1 minuto' },
                  valueAsNumber: true,
                })}
                placeholder="30"
                disabled={isPending}
              />
              {errors.durationMinutes && (
                <p className="text-sm text-red-500">{errors.durationMinutes.message}</p>
              )}
            </div>
          </div>

          {/* Tipo de servicio */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Tipo de servicio <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as 'grooming' | 'veterinary')}
              disabled={isPending}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grooming">{SERVICE_TYPE_LABELS.grooming}</SelectItem>
                <SelectItem value="veterinary">{SERVICE_TYPE_LABELS.veterinary}</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          {/* Imagen URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Imagen (URL)</Label>
            <Input
              id="image"
              {...register('image')}
              placeholder="https://ejemplo.com/imagen.jpg"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">Opcional: URL de la imagen del servicio</p>
          </div>

          {/* Estado activo (solo en edición) */}
          {!isNew && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
                disabled={isPending}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Servicio activo
              </Label>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/services')}
              disabled={isPending}
            >
              Cancelar
            </Button>

            <div className="flex gap-3">
              {/* Botón eliminar (solo en edición) */}
              {!isNew && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={isPending}>
                      <Trash2Icon className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente el servicio "
                        {service?.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* Botón guardar */}
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : isNew ? 'Crear servicio' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
