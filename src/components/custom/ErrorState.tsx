/**
 * Componente para mostrar estados de error de forma user-friendly
 *
 * Proporciona UI consistente para errores con opciones de retry
 */

import { AlertCircle, RefreshCw, WifiOff, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Tipos de error predefinidos
 */
export type ErrorType = 'generic' | 'network' | 'notFound' | 'unauthorized' | 'server';

/**
 * Props del componente ErrorState
 */
export interface ErrorStateProps {
  /** Tipo de error (define icono y mensaje por defecto) */
  type?: ErrorType;
  /** Título del error (opcional, usa default según type) */
  title?: string;
  /** Mensaje descriptivo (opcional, usa default según type) */
  message?: string;
  /** Callback para reintentar la operación */
  onRetry?: () => void;
  /** Texto del botón de retry */
  retryLabel?: string;
  /** Callback adicional (ej: volver atrás) */
  onSecondaryAction?: () => void;
  /** Texto del botón secundario */
  secondaryActionLabel?: string;
  /** Mostrar como inline (sin card) */
  inline?: boolean;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Configuración de mensajes por tipo de error
 */
const ERROR_CONFIG: Record<
  ErrorType,
  {
    icon: React.ReactNode;
    title: string;
    message: string;
  }
> = {
  generic: {
    icon: <AlertCircle className="h-12 w-12 text-destructive" />,
    title: 'Algo salió mal',
    message: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
  },
  network: {
    icon: <WifiOff className="h-12 w-12 text-destructive" />,
    title: 'Sin conexión',
    message: 'No pudimos conectar con el servidor. Verifica tu conexión a internet.',
  },
  notFound: {
    icon: <AlertCircle className="h-12 w-12 text-muted-foreground" />,
    title: 'No encontrado',
    message: 'El recurso que buscas no existe o fue eliminado.',
  },
  unauthorized: {
    icon: <AlertCircle className="h-12 w-12 text-destructive" />,
    title: 'Acceso denegado',
    message: 'No tienes permiso para acceder a este recurso.',
  },
  server: {
    icon: <ServerCrash className="h-12 w-12 text-destructive" />,
    title: 'Error del servidor',
    message: 'Estamos experimentando problemas técnicos. Por favor, intenta más tarde.',
  },
};

/**
 * Componente para mostrar estados de error
 *
 * @example
 * ```tsx
 * // Error genérico con retry
 * <ErrorState
 *   type="generic"
 *   onRetry={() => refetch()}
 * />
 *
 * // Error de red con mensaje custom
 * <ErrorState
 *   type="network"
 *   message="No se pudo cargar la lista de mascotas"
 *   onRetry={() => refetch()}
 * />
 *
 * // Error inline (sin card)
 * <ErrorState
 *   inline
 *   message="Error al cargar datos"
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export function ErrorState({
  type = 'generic',
  title: customTitle,
  message: customMessage,
  onRetry,
  retryLabel = 'Reintentar',
  onSecondaryAction,
  secondaryActionLabel = 'Volver',
  inline = false,
  className,
}: ErrorStateProps) {
  const config = ERROR_CONFIG[type];
  const title = customTitle || config.title;
  const message = customMessage || config.message;

  // Versión inline (más compacta)
  if (inline) {
    return (
      <div className={cn('flex flex-col items-center gap-4 py-8 text-center', className)}>
        {config.icon}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }

  // Versión con card (más prominente)
  return (
    <div className={cn('flex min-h-[400px] items-center justify-center p-4', className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">{config.icon}</div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        {(onRetry || onSecondaryAction) && (
          <CardFooter className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                {retryLabel}
              </Button>
            )}
            {onSecondaryAction && (
              <Button onClick={onSecondaryAction} variant="outline" className="flex-1">
                {secondaryActionLabel}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

/**
 * Componente de error compacto para inline en listas
 */
export interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className }: InlineErrorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
      <p className="flex-1 text-destructive">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="ghost" size="sm" className="shrink-0">
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * Componente para estados vacíos (no es error, pero no hay datos)
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-4 py-12 text-center', className)}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        {message && <p className="text-muted-foreground text-sm">{message}</p>}
      </div>
      {action && (
        <Button onClick={action.onClick} variant="default">
          {action.label}
        </Button>
      )}
    </div>
  );
}
