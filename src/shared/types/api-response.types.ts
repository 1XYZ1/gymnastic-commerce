/**
 * Tipos compartidos para respuestas de la API
 */

/**
 * Estructura de error de respuesta HTTP de Axios
 */
export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
      error?: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
  code?: string;
}

/**
 * Estructura genérica de respuesta API con datos
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

/**
 * Estructura de respuesta API paginada
 */
export interface PaginatedApiResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  pages?: number;
}

/**
 * Respuesta API para citas (appointments)
 * Backend puede retornar { appointments: [...] } o { data: [...] }
 */
export interface AppointmentsApiResponse {
  appointments?: unknown[];
  data?: unknown[];
  total?: number;
  limit?: number;
  offset?: number;
}

/**
 * Respuesta API para servicios
 * Backend puede retornar { services: [...] } o { data: [...] }
 */
export interface ServicesApiResponse {
  services?: unknown[];
  data?: unknown[];
  total?: number;
  limit?: number;
  offset?: number;
  pages?: number;
}

/**
 * Respuesta API para operación de eliminación
 */
export interface DeleteApiResponse {
  message?: string;
  appointment?: unknown;
}
