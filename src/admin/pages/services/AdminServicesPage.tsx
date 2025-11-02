import { Link, useNavigate } from 'react-router';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { AdminTitle } from '@/admin/components/AdminTitle';
import { AdminListItem } from '@/admin/components/AdminListItem';
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
} from '@/components/ui/alert-dialog';
import { currencyFormatter } from '@/lib/currency-formatter';
import { useAdminServices } from '@/admin/hooks/useAdminServices';
import { useServiceMutations } from '@/admin/hooks/useServiceMutations';
import { SERVICE_TYPE_LABELS } from '@/services/config/service.config';
import type { Service } from '@/services/types/service.types';

/**
 * Página de administración de servicios
 * Lista todos los servicios con opciones CRUD
 *
 * Vista responsive:
 * - Desktop (>= md): Tabla con filas clickeables
 * - Móvil (< md): AdminListItem en contenedor con space-y-3
 */
export const AdminServicesPage = () => {
  const { data, isLoading } = useAdminServices();
  const { deleteService } = useServiceMutations();
  const navigate = useNavigate();

  // Estado para controlar el diálogo de eliminación
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Handler para navegar al detalle del servicio
  const handleServiceClick = (serviceId: string) => {
    navigate(`/admin/services/${serviceId}`);
  };

  // Handler para abrir el diálogo de eliminación
  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
  };

  // Handler para confirmar la eliminación
  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      deleteService.mutate(serviceToDelete.id);
      setServiceToDelete(null);
    }
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

      {/* Desktop: Tabla con filas clickeables */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
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
                <TableRow
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  aria-label={`Ver detalles de ${service.name}`}
                >
                  <TableCell className="font-medium">{service.name}</TableCell>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(service);
                      }}
                      aria-label={`Eliminar servicio ${service.name}`}
                    >
                      <Trash2Icon className="w-4 h-4 text-red-500" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Móvil: AdminListItem */}
      <div className="md:hidden space-y-3 mb-10">
        {data?.data.map((service) => (
          <AdminListItem
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            title={service.name}
            subtitle={SERVICE_TYPE_LABELS[service.type]}
            badge={
              <Badge variant={service.isActive ? 'default' : 'secondary'}>
                {service.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            }
            metadata={[
              {
                label: 'Precio',
                value: currencyFormatter(service.price),
              },
              {
                label: 'Duración',
                value: `${service.durationMinutes} min`,
              },
            ]}
            actions={
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(service);
                }}
                aria-label={`Eliminar servicio ${service.name}`}
              >
                <Trash2Icon className="h-4 w-4 text-red-500" aria-hidden="true" />
              </Button>
            }
          />
        ))}
      </div>

      {/* AlertDialog compartido para desktop y móvil */}
      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el servicio
              "{serviceToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {data && data.data.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {data.data.length} de {data.total} servicios
        </div>
      )}
    </>
  );
};
