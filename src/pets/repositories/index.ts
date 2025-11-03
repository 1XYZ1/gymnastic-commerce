import { PetApiRepository } from './PetApiRepository';

export type { IPetRepository } from './IPetRepository';
export { PetApiRepository };

// Instancia singleton para usar en hooks
export const petRepository = new PetApiRepository();
