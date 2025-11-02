import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentForm } from '../../components/AppointmentForm';

/**
 * Página para crear una nueva cita
 * Puede recibir un serviceId preseleccionado vía query params
 */
export function NewAppointmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId') || undefined;

  const handleSuccess = () => {
    navigate('/appointments');
  };

  const handleBack = () => {
    navigate('/appointments');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          ← Volver a Mis Citas
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Agendar Nueva Cita</h1>
        <p className="text-muted-foreground mt-2">
          Selecciona un servicio y elige la fecha y hora para tu mascota
        </p>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cita</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentForm
              preselectedServiceId={preselectedServiceId}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
