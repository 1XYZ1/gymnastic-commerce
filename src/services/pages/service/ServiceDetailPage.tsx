import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { useService } from '../../hooks/useService';
import { ServiceDetail } from '../../components/ServiceDetail';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';

/**
 * Página de detalle de un servicio específico
 * Muestra información completa y opciones para agendar cita
 */
export const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: service, isLoading, error } = useService(id ?? '');

  // Estado de carga
  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  // Manejo de errores
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold">Error al cargar el servicio</h2>
          <p className="text-muted-foreground">
            No pudimos cargar la información del servicio. Por favor, intenta nuevamente más tarde.
          </p>
          <Button onClick={() => navigate('/services')}>Volver a servicios</Button>
        </div>
      </div>
    );
  }

  // Servicio no encontrado
  if (!service) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h2 className="text-2xl font-bold">Servicio no encontrado</h2>
          <p className="text-muted-foreground">
            El servicio que buscas no existe o ha sido removido.
          </p>
          <Button onClick={() => navigate('/services')}>Volver a servicios</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón de regreso */}
      <Button variant="ghost" onClick={() => navigate('/services')} className="mb-6">
        ← Volver a servicios
      </Button>

      {/* Detalle del servicio */}
      <ServiceDetail service={service} />
    </div>
  );
};
