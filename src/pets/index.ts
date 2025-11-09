/**
 * Módulo Pets - Public API
 *
 * Exports centralizados para el módulo de gestión de mascotas
 */

// Types
export type {
  Pet,
  CreatePetDto,
  UpdatePetDto,
  CompleteProfile,
  WeightHistory,
} from './types';

// Repositories
export { getPetRepository } from './repositories';

// Services
export { PetValidationService, PetAgeCalculatorService } from './services';

// Mappers
export { PetMapper } from './mappers';

// Hooks
export {
  usePets,
  usePet,
  useCompleteProfile,
  usePetMutations,
} from './hooks';

// Components
export {
  PetCard,
  PetForm,
  PetSelector,
  TemperamentBadge,
  VaccinationAlert,
} from './components';
