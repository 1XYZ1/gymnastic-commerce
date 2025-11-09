import type { Pet, CreatePetDto, UpdatePetDto, CompleteProfile, MedicalRecord, Vaccination, GroomingRecord, WeightHistory } from '../types';
import type { PetApi, CompletePetProfileApi } from '../schemas/pet.schemas';

export class PetMapper {
  /**
   * Convierte un valor a Date solo si es válido
   * Retorna undefined si la fecha es inválida
   */
  private static toSafeDate(value: string | Date | null | undefined): Date | undefined {
    if (!value) return undefined;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ [PetMapper] Invalid date value: "${value}"`);
      return undefined;
    }

    return date;
  }

  /**
   * Transforma Pet de API a dominio
   * Convierte fechas string a Date objects
   */
  static toDomain(apiPet: PetApi): Pet {
    return {
      ...apiPet,
      birthDate: apiPet.birthDate ? new Date(apiPet.birthDate) : apiPet.birthDate,
      weight: apiPet.weight ?? undefined, // Convertir null a undefined
      microchipNumber: apiPet.microchipNumber ?? undefined, // Convertir null a undefined
      profilePhoto: apiPet.profilePhoto ?? undefined, // Convertir null a undefined
      createdAt: new Date(apiPet.createdAt),
      updatedAt: new Date(apiPet.updatedAt),
      behaviorNotes: apiPet.behaviorNotes || [],
    };
  }

  /**
   * Transforma DTO a formato API
   * Asegura que las fechas estén en formato ISO string
   */
  static toApi(dto: CreatePetDto | UpdatePetDto): Record<string, unknown> {
    return {
      ...dto,
      // birthDate ya viene en formato "YYYY-MM-DD" desde el formulario
    };
  }

  /**
   * Transforma CompleteProfile de API a dominio
   * Convierte todas las fechas anidadas
   */
  static completeProfileToDomain(apiProfile: CompletePetProfileApi): CompleteProfile {
    return {
      ...apiProfile,
      pet: this.toDomain(apiProfile.pet),
      medicalHistory: {
        ...apiProfile.medicalHistory,
        // Mapear campos del backend: date → visitDate
        recentVisits: (apiProfile.medicalHistory?.recentVisits
          ?.map((visit: Record<string, unknown>): MedicalRecord | null => {
            // Backend devuelve "date", frontend espera "visitDate"
            const visitDate = this.toSafeDate((visit.date as string | Date | undefined) || (visit.visitDate as string | Date | undefined));
            if (!visitDate) return null; // Filtrar registros sin fecha válida

            return {
              ...visit,
              id: typeof visit.id === 'string' ? visit.id : String(visit.id || ''),
              visitDate,
              visitType: visit.visitType as any, // VisitType viene del backend, confiamos en validación
              reason: typeof visit.reason === 'string' ? visit.reason : '',
              createdAt: this.toSafeDate(visit.createdAt as string | Date | undefined) || new Date(),
              updatedAt: this.toSafeDate(visit.updatedAt as string | Date | undefined) || new Date(),
            };
          })
          .filter((visit): visit is MedicalRecord => visit !== null) || []),
      },
      vaccinations: {
        ...apiProfile.vaccinations,
        // Mapear campos del backend: dateApplied → administeredDate, name → vaccineName
        activeVaccines: (apiProfile.vaccinations?.activeVaccines
          ?.map((vaccine: Record<string, unknown>): Vaccination | null => {
            // Backend devuelve "dateApplied", frontend espera "administeredDate"
            const administeredDate = this.toSafeDate((vaccine.dateApplied as string | Date | undefined) || (vaccine.administeredDate as string | Date | undefined));
            if (!administeredDate) return null; // Filtrar vacunas sin fecha válida

            return {
              ...vaccine,
              id: typeof vaccine.id === 'string' ? vaccine.id : String(vaccine.id || ''),
              // Backend: "name" → Frontend: "vaccineName"
              // Validación de tipos antes de usar las propiedades
              vaccineName:
                (typeof vaccine.vaccineName === 'string' && vaccine.vaccineName) ? vaccine.vaccineName :
                (typeof vaccine.name === 'string' && vaccine.name) ? vaccine.name :
                'Vacuna',
              administeredDate,
              nextDueDate: this.toSafeDate(vaccine.nextDueDate as string | Date | null | undefined),
              createdAt: this.toSafeDate(vaccine.createdAt as string | Date | undefined) || new Date(),
            };
          })
          .filter((vaccine): vaccine is Vaccination => vaccine !== null) || []),
        upcomingVaccines: (apiProfile.vaccinations?.upcomingVaccines
          ?.map((vaccine: Record<string, unknown>): Vaccination | null => {
            const administeredDate = this.toSafeDate((vaccine.dateApplied as string | Date | undefined) || (vaccine.administeredDate as string | Date | undefined));

            return {
              ...vaccine,
              id: typeof vaccine.id === 'string' ? vaccine.id : String(vaccine.id || ''),
              // Validación de tipos antes de usar las propiedades
              vaccineName:
                (typeof vaccine.vaccineName === 'string' && vaccine.vaccineName) ? vaccine.vaccineName :
                (typeof vaccine.name === 'string' && vaccine.name) ? vaccine.name :
                'Vacuna',
              administeredDate: administeredDate || new Date(), // Fecha por defecto para upcoming
              nextDueDate: this.toSafeDate(vaccine.nextDueDate as string | Date | null | undefined),
              createdAt: this.toSafeDate(vaccine.createdAt as string | Date | undefined) || new Date(),
            };
          })
          .filter((vaccine): vaccine is Vaccination => vaccine !== null) || []),
      },
      // weightHistory con validación de fechas
      weightHistory: (apiProfile.weightHistory
        ?.map((entry: Record<string, unknown>): WeightHistory | null => {
          const date = this.toSafeDate(entry.date as string | Date | undefined);
          if (!date) return null;

          return {
            ...entry,
            date,
            weight: typeof entry.weight === 'number' ? entry.weight : 0,
            source: entry.source as any, // WeightSource viene del backend
          };
        })
        .filter((entry): entry is WeightHistory => entry !== null) || []),
      groomingHistory: {
        ...apiProfile.groomingHistory,
        lastSessionDate: this.toSafeDate(apiProfile.groomingHistory?.lastSessionDate as string | Date | null | undefined),
        // Mapear campos del backend: date → sessionDate, serviceType → servicesPerformed
        recentSessions: (apiProfile.groomingHistory?.recentSessions
          ?.map((session: Record<string, unknown>): GroomingRecord | null => {
            // Backend devuelve "date", frontend espera "sessionDate"
            const sessionDate = this.toSafeDate((session.date as string | Date | undefined) || (session.sessionDate as string | Date | undefined));
            if (!sessionDate) return null; // Filtrar sesiones sin fecha válida

            // Backend: "serviceType" (string) → Frontend: "servicesPerformed" (array)
            let servicesPerformed: string[] = [];
            if (Array.isArray(session.servicesPerformed)) {
              servicesPerformed = session.servicesPerformed as string[];
            } else if (typeof session.serviceType === 'string') {
              // Convertir string a array (separar por coma)
              servicesPerformed = session.serviceType.split(',').map((s: string) => s.trim());
            } else if (typeof session.servicesPerformed === 'string') {
              servicesPerformed = [session.servicesPerformed];
            }

            return {
              ...session,
              id: typeof session.id === 'string' ? session.id : String(session.id || ''),
              sessionDate,
              servicesPerformed,
              durationMinutes: typeof session.durationMinutes === 'number' ? session.durationMinutes : 0,
              createdAt: this.toSafeDate(session.createdAt as string | Date | undefined) || new Date(),
              updatedAt: this.toSafeDate(session.updatedAt as string | Date | undefined) || new Date(),
            };
          })
          .filter((session): session is GroomingRecord => session !== null) || []),
      },
      // Mapear appointments (backend las devuelve, pero no se estaban mapeando)
      appointments: {
        upcoming: (apiProfile.appointments?.upcoming || []).map((apt: any) => ({
          ...apt,
          id: typeof apt.id === 'string' ? apt.id : String(apt.id || ''),
          date: this.toSafeDate(apt.date) || new Date(),
          status: typeof apt.status === 'string' ? apt.status : 'pending',
          pet: apt.pet || {},
          service: apt.service || { id: '', name: '', type: '' },
          customer: apt.customer || { id: '', fullName: '', email: '' },
          createdAt: this.toSafeDate(apt.createdAt) || new Date(),
          updatedAt: this.toSafeDate(apt.updatedAt) || new Date(),
        })),
        past: (apiProfile.appointments?.past || []).map((apt: any) => ({
          ...apt,
          id: typeof apt.id === 'string' ? apt.id : String(apt.id || ''),
          date: this.toSafeDate(apt.date) || new Date(),
          status: typeof apt.status === 'string' ? apt.status : 'completed',
          pet: apt.pet || {},
          service: apt.service || { id: '', name: '', type: '' },
          customer: apt.customer || { id: '', fullName: '', email: '' },
          createdAt: this.toSafeDate(apt.createdAt) || new Date(),
          updatedAt: this.toSafeDate(apt.updatedAt) || new Date(),
        })),
        totalAppointments: apiProfile.appointments?.totalAppointments || 0,
      },
      summary: {
        age: apiProfile.summary?.age || 0,
        totalSpentMedical: apiProfile.summary?.totalSpentMedical || 0,
        totalSpentGrooming: apiProfile.summary?.totalSpentGrooming || 0,
        lastVisitDate: this.toSafeDate(apiProfile.summary?.lastVisitDate),
        nextVaccinationDue: this.toSafeDate(apiProfile.summary?.nextVaccinationDue),
      },
    };
  }
}
