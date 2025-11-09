import { GroomingApiRepository } from './GroomingApiRepository';

export type { IGroomingRepository } from './IGroomingRepository';
export { GroomingApiRepository };

// Lazy initialization: singleton se crea cuando se usa, no cuando se importa
// Esto evita problemas de dependencias circulares en producción
let _groomingRepository: GroomingApiRepository | undefined;

const getGroomingRepository = (): GroomingApiRepository => {
  if (!_groomingRepository) {
    _groomingRepository = new GroomingApiRepository();
  }
  return _groomingRepository;
};

// Singleton del repositorio para uso en toda la aplicación
export const groomingRepository = getGroomingRepository();
