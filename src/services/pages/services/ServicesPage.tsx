import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useServices } from '../../hooks/useServices';
import { ServicesList } from '../../components/ServicesList';
import { SERVICE_TYPE_LABELS } from '../../config/service.config';
import type { ServiceType } from '../../types/service.types';

/**
 * Página principal de servicios
 * Muestra el catálogo de servicios disponibles para agendar
 */
export const ServicesPage = () => {
  const [selectedType, setSelectedType] = useState<ServiceType | 'all'>('all');

  // Obtener servicios disponibles (público)
  const serviceFilter = selectedType !== 'all' ? { type: selectedType } : undefined;
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useServices(serviceFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Nuestros Servicios</h1>
        <p className="text-muted-foreground mb-6">
          Servicios profesionales de veterinaria y peluquería para tu mascota
        </p>

        {/* Filtro por tipo */}
        <div className="flex items-center gap-3">
          <label htmlFor="service-type-filter" className="text-sm font-medium">
            Filtrar por tipo:
          </label>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as ServiceType | 'all')}
          >
            <SelectTrigger id="service-type-filter" className="w-[200px]">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              <SelectItem value="grooming">{SERVICE_TYPE_LABELS.grooming}</SelectItem>
              <SelectItem value="veterinary">{SERVICE_TYPE_LABELS.veterinary}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Manejo de errores */}
      {servicesError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-destructive">
            Error al cargar los servicios. Por favor, intenta nuevamente más tarde.
          </p>
        </div>
      )}

      {/* Lista de servicios */}
      <ServicesList services={servicesData?.data ?? []} isLoading={servicesLoading} />

      {/* Información de resultados */}
      {servicesData && servicesData.data.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Mostrando {servicesData.data.length} de {servicesData.total} servicios disponibles
        </div>
      )}
    </div>
  );
};
