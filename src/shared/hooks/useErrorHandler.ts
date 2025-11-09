/**
 * Hook personalizado para manejo de errores en componentes React
 *
 * Proporciona una interfaz simple para manejar errores con el
 * GlobalErrorService, adaptado al contexto de componentes.
 */

import { useCallback } from 'react';
import {
  GlobalErrorService,
  ErrorSeverity,
  type ErrorHandlerOptions,
} from '../services/GlobalErrorService';

/**
 * Opciones para el hook useErrorHandler
 */
export interface UseErrorHandlerOptions extends Omit<ErrorHandlerOptions, 'context'> {
  /** Nombre del componente para contexto de logging */
  componentName?: string;
}

/**
 * Resultado del hook useErrorHandler
 */
export interface ErrorHandler {
  /** Maneja un error con opciones por defecto del componente */
  handleError: (error: unknown, customOptions?: Partial<ErrorHandlerOptions>) => void;

  /** Maneja error de validación */
  handleValidationError: (error: unknown, formErrors?: Record<string, string>) => void;

  /** Maneja error de red */
  handleNetworkError: () => void;

  /** Maneja error de timeout */
  handleTimeoutError: () => void;

  /** Wrapper para operaciones async */
  withErrorHandling: <T>(
    operation: () => Promise<T>,
    customOptions?: Partial<ErrorHandlerOptions>
  ) => Promise<T | null>;
}

/**
 * Hook para manejo de errores en componentes
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { handleError, withErrorHandling } = useErrorHandler({
 *     componentName: 'MyComponent',
 *     showToast: true
 *   });
 *
 *   const fetchData = async () => {
 *     try {
 *       const data = await api.getData();
 *       // ...
 *     } catch (error) {
 *       handleError(error);
 *     }
 *   };
 *
 *   // O usando wrapper:
 *   const fetchDataSafe = () => withErrorHandling(
 *     () => api.getData(),
 *     { customMessage: 'Error al cargar datos' }
 *   );
 * };
 * ```
 */
export function useErrorHandler(defaultOptions: UseErrorHandlerOptions = {}): ErrorHandler {
  const { componentName, ...baseOptions } = defaultOptions;

  /**
   * Maneja un error con las opciones del componente
   */
  const handleError = useCallback(
    (error: unknown, customOptions?: Partial<ErrorHandlerOptions>) => {
      const context = componentName || customOptions?.context;

      GlobalErrorService.handleError(error, {
        ...baseOptions,
        ...customOptions,
        context,
      });
    },
    [componentName, baseOptions]
  );

  /**
   * Maneja errores de validación
   */
  const handleValidationError = useCallback(
    (error: unknown, formErrors?: Record<string, string>) => {
      GlobalErrorService.handleValidationError(error, formErrors);
    },
    []
  );

  /**
   * Maneja errores de conexión
   */
  const handleNetworkError = useCallback(() => {
    GlobalErrorService.handleNetworkError();
  }, []);

  /**
   * Maneja errores de timeout
   */
  const handleTimeoutError = useCallback(() => {
    GlobalErrorService.handleTimeoutError();
  }, []);

  /**
   * Wrapper para operaciones async con manejo de errores
   */
  const withErrorHandling = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      customOptions?: Partial<ErrorHandlerOptions>
    ): Promise<T | null> => {
      try {
        return await operation();
      } catch (error) {
        handleError(error, customOptions);
        return null;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleValidationError,
    handleNetworkError,
    handleTimeoutError,
    withErrorHandling,
  };
}

/**
 * Hook especializado para errores de mutaciones (React Query)
 *
 * @example
 * ```tsx
 * const MyForm = () => {
 *   const { handleMutationError } = useMutationErrorHandler('MyForm');
 *
 *   const mutation = useMutation({
 *     mutationFn: createPet,
 *     onError: handleMutationError
 *   });
 * };
 * ```
 */
export function useMutationErrorHandler(componentName?: string) {
  const { handleError } = useErrorHandler({ componentName });

  const handleMutationError = useCallback(
    (error: unknown) => {
      handleError(error, {
        showToast: true,
        severity: ErrorSeverity.ERROR,
      });
    },
    [handleError]
  );

  return { handleMutationError };
}

/**
 * Hook especializado para errores de queries (React Query)
 *
 * @example
 * ```tsx
 * const MyList = () => {
 *   const { handleQueryError } = useQueryErrorHandler('MyList');
 *
 *   const { data, error } = useQuery({
 *     queryKey: ['pets'],
 *     queryFn: getPets
 *   });
 *
 *   if (error) {
 *     handleQueryError(error);
 *   }
 * };
 * ```
 */
export function useQueryErrorHandler(componentName?: string) {
  const { handleError } = useErrorHandler({ componentName });

  const handleQueryError = useCallback(
    (error: unknown, options?: { silent?: boolean }) => {
      if (options?.silent) {
        // Solo logging, sin toast
        handleError(error, {
          showToast: false,
          severity: ErrorSeverity.WARNING,
        });
      } else {
        handleError(error, {
          showToast: true,
          severity: ErrorSeverity.ERROR,
        });
      }
    },
    [handleError]
  );

  return { handleQueryError };
}
