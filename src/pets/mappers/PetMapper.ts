import type { Pet, CreatePetDto, UpdatePetDto, CompleteProfile } from '../types';
import type { PetApi, CompletePetProfileApi } from '../schemas/pet.schemas';

export class PetMapper {
  /**
   * Convierte un valor a Date solo si es válido
   * Retorna undefined si la fecha es inválida
   */
  private static toSafeDate(value: any): Date | undefined {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toApi(dto: CreatePetDto | UpdatePetDto): Record<string, any> {
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
        recentVisits: apiProfile.medicalHistory?.recentVisits
          ?.map((visit: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            // Backend devuelve "date", frontend espera "visitDate"
            const visitDate = this.toSafeDate(visit.date || visit.visitDate);
            if (!visitDate) return null; // Filtrar registros sin fecha válida

            return {
              ...visit,
              visitDate,
              createdAt: this.toSafeDate(visit.createdAt) || new Date(),
              updatedAt: this.toSafeDate(visit.updatedAt) || new Date(),
            };
          })
          .filter((visit): visit is NonNullable<typeof visit> => visit !== null) || [],
      },
      vaccinations: {
        ...apiProfile.vaccinations,
        // Mapear campos del backend: dateApplied → administeredDate, name → vaccineName
        activeVaccines: apiProfile.vaccinations?.activeVaccines
          ?.map((vaccine: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            // Backend devuelve "dateApplied", frontend espera "administeredDate"
            const administeredDate = this.toSafeDate(vaccine.dateApplied || vaccine.administeredDate);
            if (!administeredDate) return null; // Filtrar vacunas sin fecha válida

            return {
              ...vaccine,
              // Backend: "name" → Frontend: "vaccineName"
              vaccineName: vaccine.vaccineName || vaccine.name || 'Vacuna',
              administeredDate,
              nextDueDate: this.toSafeDate(vaccine.nextDueDate),
              createdAt: this.toSafeDate(vaccine.createdAt) || new Date(),
            };
          })
          .filter((vaccine): vaccine is NonNullable<typeof vaccine> => vaccine !== null) || [],
        upcomingVaccines: apiProfile.vaccinations?.upcomingVaccines
          ?.map((vaccine: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            return {
              ...vaccine,
              vaccineName: vaccine.vaccineName || vaccine.name || 'Vacuna',
              administeredDate: this.toSafeDate(vaccine.dateApplied || vaccine.administeredDate),
              nextDueDate: this.toSafeDate(vaccine.nextDueDate),
              createdAt: this.toSafeDate(vaccine.createdAt) || new Date(),
            };
          })
          .filter((vaccine): vaccine is NonNullable<typeof vaccine> => vaccine !== null) || [],
      },
      // weightHistory con validación de fechas
      weightHistory: apiProfile.weightHistory
        ?.map((entry: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const date = this.toSafeDate(entry.date);
          if (!date) return null;

          return {
            ...entry,
            date,
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null) || [],
      groomingHistory: {
        ...apiProfile.groomingHistory,
        lastSessionDate: this.toSafeDate(apiProfile.groomingHistory?.lastSessionDate),
        // Mapear campos del backend: date → sessionDate, serviceType → servicesPerformed
        recentSessions: apiProfile.groomingHistory?.recentSessions
          ?.map((session: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            // Backend devuelve "date", frontend espera "sessionDate"
            const sessionDate = this.toSafeDate(session.date || session.sessionDate);
            if (!sessionDate) return null; // Filtrar sesiones sin fecha válida

            // Backend: "serviceType" (string) → Frontend: "servicesPerformed" (array)
            let servicesPerformed: string[] = [];
            if (Array.isArray(session.servicesPerformed)) {
              servicesPerformed = session.servicesPerformed;
            } else if (typeof session.serviceType === 'string') {
              // Convertir string a array (separar por coma)
              servicesPerformed = session.serviceType.split(',').map((s: string) => s.trim());
            } else if (typeof session.servicesPerformed === 'string') {
              servicesPerformed = [session.servicesPerformed];
            }

            return {
              ...session,
              sessionDate,
              servicesPerformed,
              createdAt: this.toSafeDate(session.createdAt) || new Date(),
              updatedAt: this.toSafeDate(session.updatedAt) || new Date(),
            };
          })
          .filter((session): session is NonNullable<typeof session> => session !== null) || [],
      },
      // Mapear appointments (backend las devuelve, pero no se estaban mapeando)
      appointments: {
        upcoming: apiProfile.appointments?.upcoming || [],
        past: apiProfile.appointments?.past || [],
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
