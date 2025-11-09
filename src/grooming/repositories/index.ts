import { GroomingApiRepository } from './GroomingApiRepository';

export type { IGroomingRepository } from './IGroomingRepository';
export { GroomingApiRepository };

// Lazy initialization: singleton se crea cuando se usa, no cuando se importa
// Esto evita problemas de dependencias circulares en producción
let _groomingRepository: GroomingApiRepository | undefined;

// Exportar función getter para lazy initialization
export const getGroomingRepository = (): GroomingApiRepository => {
  if (!_groomingRepository) {
    _groomingRepository = new GroomingApiRepository();
  }
  return _groomingRepository;
};
