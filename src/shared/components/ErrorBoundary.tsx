import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary para capturar errores en el árbol de componentes React.
 * Muestra UI user-friendly cuando ocurre un error y permite recuperación.
 *
 * Uso:
 * ```tsx
 * <ErrorBoundary>
 *   <ComponenteQuePuedeFailar />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Actualizar estado para mostrar fallback UI en el próximo render
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Logging del error para debugging
    console.error('ErrorBoundary capturó un error:', error)
    console.error('Stack de componentes:', errorInfo.componentStack)

    // Callback opcional para logging externo (ej: Sentry)
    this.props.onError?.(error, errorInfo)

    // Guardar errorInfo en el estado
    this.setState({
      errorInfo
    })
  }

  /**
   * Resetear el error boundary y reintentar renderizar
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  /**
   * Recargar la página completa (último recurso)
   */
  handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback } = this.props

    // Si hay error, mostrar UI de error
    if (hasError) {
      // Si se provee un fallback custom, usarlo
      if (fallback) {
        return fallback
      }

      // UI por defecto user-friendly
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle>Algo salió mal</CardTitle>
              </div>
              <CardDescription>
                Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Mensaje de error principal */}
              <div className="rounded-lg bg-destructive/10 p-4">
                <p className="font-mono text-sm text-destructive">
                  {error?.message || 'Error desconocido'}
                </p>
              </div>

              {/* Detalles técnicos (solo en desarrollo) */}
              {import.meta.env.DEV && errorInfo && (
                <details className="cursor-pointer rounded-lg border p-4">
                  <summary className="font-semibold text-sm">
                    Detalles técnicos (solo visible en desarrollo)
                  </summary>
                  <pre className="mt-2 overflow-auto text-xs">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button onClick={this.handleReset} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reintentar
              </Button>
              <Button onClick={this.handleReload} variant="outline">
                Recargar página
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    // No hay error, renderizar children normalmente
    return children
  }
}
