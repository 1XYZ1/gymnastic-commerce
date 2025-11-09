import { PetApiRepository } from './PetApiRepository';

export type { IPetRepository } from './IPetRepository';
export { PetApiRepository };

// Lazy initialization: singleton se crea cuando se usa, no cuando se importa
// Esto evita problemas de dependencias circulares en producción
let _petRepository: PetApiRepository | undefined;

// Exportar función getter para lazy initialization
export const getPetRepository = (): PetApiRepository => {
  if (!_petRepository) {
    _petRepository = new PetApiRepository();
  }
  return _petRepository;
};
