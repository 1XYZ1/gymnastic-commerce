import { useMemo } from 'react';
import { FileText, Sparkles, Calendar, Syringe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CompleteProfile } from '@/pets/types';

interface PetActivityTimelineProps {
  profile: CompleteProfile;
}

type ActivityEvent = {
  id: string;
  type: 'medical' | 'grooming' | 'appointment' | 'vaccination';
  title: string;
  description: string;
  date: Date;
  icon: typeof FileText;
  color: string;
  bgColor: string;
};

/**
 * Valida si un valor puede convertirse a una fecha válida
 */
function isValidDateValue(value: string | Date | null | undefined): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Componente de timeline que muestra actividades recientes de la mascota
 * Combina eventos de medical, grooming, appointments y vacunas
 * Ordenados por fecha (más reciente primero)
 */
export function PetActivityTimeline({ profile }: PetActivityTimelineProps) {
  const activities = useMemo(() => {
    const events: ActivityEvent[] = [];

    // Agregar visitas médicas (con validaciones)
    profile.medicalHistory?.recentVisits?.forEach((record) => {
      if (!record?.id || !record?.visitDate) return;

      // Validar que la fecha sea realmente válida
      if (!isValidDateValue(record.visitDate)) {
        console.warn(`Invalid visitDate for medical record ${record.id}:`, record.visitDate);
        return;
      }

      events.push({
        id: `medical-${record.id}`,
        type: 'medical',
        title: 'Consulta médica',
        description: record.reason || 'Visita médica general',
        date: new Date(record.visitDate),
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      });
    });

    // Agregar vacunas (con validaciones)
    profile.vaccinations?.activeVaccines?.forEach((vac) => {
      if (!vac?.id || !vac?.administeredDate) return;

      // Validar que la fecha sea realmente válida
      if (!isValidDateValue(vac.administeredDate)) {
        console.warn(`Invalid administeredDate for vaccination ${vac.id}:`, vac.administeredDate);
        return;
      }

      events.push({
        id: `vaccination-${vac.id}`,
        type: 'vaccination',
        title: 'Vacuna aplicada',
        description: vac.vaccineName || 'Vacuna',
        date: new Date(vac.administeredDate),
        icon: Syringe,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      });
    });

    // Agregar sesiones de grooming (con validaciones)
    profile.groomingHistory?.recentSessions?.forEach((session) => {
      if (!session?.id || !session?.sessionDate) return;

      // Validar que la fecha sea realmente válida
      if (!isValidDateValue(session.sessionDate)) {
        console.warn(`Invalid sessionDate for grooming ${session.id}:`, session.sessionDate);
        return;
      }

      // Manejar servicesPerformed que puede ser undefined o no ser un array
      const services = Array.isArray(session.servicesPerformed)
        ? session.servicesPerformed.join(', ')
        : 'Sesión de grooming';

      events.push({
        id: `grooming-${session.id}`,
        type: 'grooming',
        title: 'Sesión de grooming',
        description: services || 'Sesión de grooming',
        date: new Date(session.sessionDate),
        icon: Sparkles,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
      });
    });

    // Agregar citas (solo pasadas/completadas, con validaciones)
    profile.appointments?.past?.forEach((appointment) => {
      if (!appointment?.id || !appointment?.date || !appointment?.service) return;

      // Validar que la fecha sea realmente válida
      if (!isValidDateValue(appointment.date)) {
        console.warn(`Invalid date for appointment ${appointment.id}:`, appointment.date);
        return;
      }

      const serviceType = appointment.service.type === 'grooming' || appointment.service.type === 'veterinary'
        ? 'Grooming'
        : 'Médico';

      const serviceName = appointment.service.name || 'Servicio';

      events.push({
        id: `appointment-${appointment.id}`,
        type: 'appointment',
        title: 'Cita completada',
        description: `${serviceName} - ${serviceType}`,
        date: new Date(appointment.date),
        icon: Calendar,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
      });
    });

    // Ordenar por fecha descendente (más reciente primero)
    return events
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10); // Mostrar últimas 10 actividades
  }, [profile]);

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8">
        <p className="text-muted-foreground text-xs sm:text-sm">
          No hay actividades registradas todavía
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        const timeAgo = formatDistanceToNow(activity.date, {
          addSuffix: true,
          locale: es,
        });

        return (
          <div key={activity.id} className="flex gap-3 sm:gap-4">
            {/* Línea vertical y círculo */}
            <div className="flex flex-col items-center">
              <div className={`p-1.5 sm:p-2 rounded-full ${activity.bgColor} ${activity.color} shrink-0`}>
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              {index < activities.length - 1 && (
                <div className="w-0.5 h-full bg-border mt-1.5 sm:mt-2" />
              )}
            </div>

            {/* Contenido del evento */}
            <div className="flex-1 pb-4 sm:pb-6 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs sm:text-sm">{activity.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0 whitespace-nowrap">
                  {timeAgo}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}

      {/* Mensaje si hay más de 10 actividades */}
      {((profile.medicalHistory?.totalVisits || 0) +
        (profile.groomingHistory?.totalSessions || 0) +
        (profile.appointments?.totalAppointments || 0)) > 10 && (
        <div className="text-center pt-1 sm:pt-2">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Mostrando las 10 actividades más recientes
          </p>
        </div>
      )}
    </div>
  );
}
