import type { MedicalRecord, Vaccination, CreateMedicalRecordDto, CreateVaccinationDto } from '../types';

/**
 * Interface del repositorio de registros médicos
 * Dependency Inversion Principle - Los servicios dependen de esta interfaz, no de la implementación
 */
export interface IMedicalRepository {
  // Medical Records
  findByPetId(petId: string): Promise<MedicalRecord[]>;
  findById(id: string): Promise<MedicalRecord>;
  create(dto: CreateMedicalRecordDto): Promise<MedicalRecord>;
  update(id: string, dto: Partial<CreateMedicalRecordDto>): Promise<MedicalRecord>;
  delete(id: string): Promise<{ message: string; id: string }>;

  // Vaccinations
  createVaccination(dto: CreateVaccinationDto): Promise<Vaccination>;
  findVaccinationsByPetId(petId: string): Promise<Vaccination[]>;
  findVaccinationById(id: string): Promise<Vaccination>;
  updateVaccination(id: string, dto: Partial<CreateVaccinationDto>): Promise<Vaccination>;
  deleteVaccination(id: string): Promise<{ message: string; id: string }>;

  // Vacunas próximas a vencer (solo admin)
  findVaccinationsDue(): Promise<Vaccination[]>;
}
