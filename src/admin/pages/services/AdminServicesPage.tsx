import { Link } from 'react-router';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { AdminTitle } from '@/admin/components/AdminTitle';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
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
import { currencyFormatter } from '@/lib/currency-formatter';
import { useAdminServices } from '@/admin/hooks/useAdminServices';
import { useServiceMutations } from '@/admin/hooks/useServiceMutations';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';

/**
 * Página de administración de servicios
 * Lista todos los servicios con opciones CRUD
 */
export const AdminServicesPage = () => {
  const { data, isLoading } = useAdminServices();
  const { deleteService } = useServiceMutations();

  const handleDelete = (id: string) => {
    deleteService.mutate(id);
  };

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle title="Servicios" subtitle="Aquí puedes ver y administrar tus servicios" />

        <div className="flex justify-end mb-10 gap-4">
          <Link to="/admin/services/new">
            <Button>
              <PlusIcon />
              Nuevo servicio
            </Button>
          </Link>
        </div>
      </div>

      <Table
        className="bg-white p-10 shadow-xs border border-gray-200 mb-10"
        aria-label="Tabla de servicios"
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Nombre</TableHead>
            <TableHead scope="col">Tipo</TableHead>
            <TableHead scope="col">Precio</TableHead>
            <TableHead scope="col">Duración</TableHead>
            <TableHead scope="col">Estado</TableHead>
            <TableHead scope="col" className="text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <Link
                  to={`/admin/services/${service.id}`}
                  className="hover:text-blue-500 underline"
                  aria-label={`Editar servicio ${service.name}`}
                >
                  {service.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{SERVICE_TYPE_LABELS[service.type]}</Badge>
              </TableCell>
              <TableCell>{currencyFormatter(service.price)}</TableCell>
              <TableCell>{service.durationMinutes} min</TableCell>
              <TableCell>
                <Badge variant={service.isActive ? 'default' : 'secondary'}>
                  {service.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/admin/services/${service.id}`}
                    aria-label={`Editar servicio ${service.name}`}
                  >
                    <Button variant="ghost" size="icon">
                      <PencilIcon className="w-4 h-4 text-blue-500" aria-hidden="true" />
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar servicio ${service.name}`}
                      >
                        <Trash2Icon className="w-4 h-4 text-red-500" aria-hidden="true" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente el servicio
                          "{service.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(service.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data && data.data.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {data.data.length} de {data.total} servicios
        </div>
      )}
    </>
  );
};
