// Types
export type * from './types/medical.types';

// Repositories
export { getMedicalRepository } from './repositories';
export type { IMedicalRepository } from './repositories';

// Services
export { MedicalValidationService, VaccinationService } from './services';

// Hooks
export {
  useMedicalRecords,
  useMedicalRecord,
  useVaccinations,
  useVaccinationsDue,
  useMedicalMutations,
  useVaccinationMutations,
} from './hooks';
