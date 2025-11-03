import { useQuery } from '@tanstack/react-query';
import { medicalRepository } from '../repositories';
import type { MedicalRecord } from '../types/medical.types';

/**
 * Hook para obtener un registro médico específico por ID
 * Usa React Query para cache y sincronización con el servidor
 */
export const useMedicalRecord = (id: string | undefined, enabled = true) => {
  return useQuery<MedicalRecord, Error>({
    queryKey: ['medical-record', id],
    queryFn: () => {
      if (!id) throw new Error('Medical record ID is required');
      return medicalRepository.findById(id);
    },
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,
  });
};
