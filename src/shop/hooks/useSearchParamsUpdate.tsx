import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export interface UseSearchParamsUpdateReturn {
  updateParam: (key: string, value: string | null) => void;
  updateMultipleParams: (params: Record<string, string | null>) => void;
  deleteParam: (key: string) => void;
  searchParams: URLSearchParams;
}

/**
 * Hook para actualizar search params de forma simplificada
 *
 * @example
 * const { updateParam } = useSearchParamsUpdate();
 * updateParam('page', '2');  // Actualiza page=2
 * updateParam('query', null); // Elimina query
 *
 * @example
 * const { updateMultipleParams } = useSearchParamsUpdate();
 * updateMultipleParams({ page: '1', sizes: 'xs,l' }); // Actualiza múltiples params
 */
export const useSearchParamsUpdate = (): UseSearchParamsUpdateReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const newParams = new URLSearchParams(searchParams);

      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const updateMultipleParams = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const deleteParam = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return {
    updateParam,
    updateMultipleParams,
    deleteParam,
    searchParams,
  };
};
