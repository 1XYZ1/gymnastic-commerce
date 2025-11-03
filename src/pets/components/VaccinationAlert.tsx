import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import type { Vaccination } from '@/medical/types';
import { differenceInDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VaccinationAlertProps {
  vaccination: Vaccination;
}

export function VaccinationAlert({ vaccination }: VaccinationAlertProps) {
  if (!vaccination.nextDueDate) return null;

  const daysUntilDue = differenceInDays(new Date(vaccination.nextDueDate), new Date());

  const severity = daysUntilDue < 7 ? 'error' : daysUntilDue < 30 ? 'warning' : 'info';

  const variants = {
    error: { icon: AlertTriangle, className: 'border-red-500 bg-red-50' },
    warning: { icon: AlertTriangle, className: 'border-yellow-500 bg-yellow-50' },
    info: { icon: Info, className: 'border-blue-500 bg-blue-50' },
  };

  const config = variants[severity];
  const Icon = config.icon;

  return (
    <Alert className={config.className} role="alert">
      <Icon className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>{vaccination.vaccineName}</AlertTitle>
      <AlertDescription>
        Vence en {daysUntilDue} días -{' '}
        {format(new Date(vaccination.nextDueDate), "dd 'de' MMMM 'de' yyyy", { locale: es })}
      </AlertDescription>
    </Alert>
  );
}
