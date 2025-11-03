import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Loader2, AlertCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMedicalRecord } from '@/medical/hooks';
import { MedicalRecordDetail } from '@/medical/components';

export function MedicalRecordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: record, isLoading, error } = useMedicalRecord(id);

  const handleBack = () => {
    if (record?.pet?.id) {
      navigate(`/pets/${record.pet.id}/medical`);
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error al cargar el registro médico</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error?.message || 'No se encontró el registro'}
          </p>
          <Button onClick={() => navigate('/pets')} className="mt-4">
            Volver a Mis Mascotas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al historial
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Registro Médico</h1>
            {record.pet && (
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Mascota: {record.pet.name}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => navigate(`/medical-records/${id}/edit`)}
            className="w-full sm:w-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Detail Component */}
      <MedicalRecordDetail record={record} />
    </div>
  );
}
