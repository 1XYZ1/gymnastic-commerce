import { GroomingApiRepository } from './GroomingApiRepository';

export type { IGroomingRepository } from './IGroomingRepository';
export { GroomingApiRepository };

// Singleton del repositorio para uso en toda la aplicación
export const groomingRepository = new GroomingApiRepository();
