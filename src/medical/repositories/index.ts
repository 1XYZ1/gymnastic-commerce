import { MedicalApiRepository } from './MedicalApiRepository';

export type { IMedicalRepository } from './IMedicalRepository';
export { MedicalApiRepository };

// Lazy initialization: singleton se crea cuando se usa, no cuando se importa
// Esto evita problemas de dependencias circulares en producción
let _medicalRepository: MedicalApiRepository | undefined;

// Exportar función getter para lazy initialization
export const getMedicalRepository = (): MedicalApiRepository => {
  if (!_medicalRepository) {
    _medicalRepository = new MedicalApiRepository();
  }
  return _medicalRepository;
};
