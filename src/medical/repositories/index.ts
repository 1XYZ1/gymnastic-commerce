import { MedicalApiRepository } from './MedicalApiRepository';

export type { IMedicalRepository } from './IMedicalRepository';
export { MedicalApiRepository };

// Instancia singleton para usar en hooks
export const medicalRepository = new MedicalApiRepository();
