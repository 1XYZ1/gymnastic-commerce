/**
 * Componentes de Skeleton para estados de carga
 *
 * Proporciona feedback visual mientras se cargan los datos
 */

import { cn } from '@/lib/utils';

/**
 * Skeleton base - bloque rectangular con animación
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

/**
 * Skeleton para texto - línea con ancho variable
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 1, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 w-full"
          style={{
            width: i === lines - 1 ? '80%' : '100%', // Última línea más corta
          }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton para Card de producto
 */
export function SkeletonProductCard() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      {/* Imagen */}
      <Skeleton className="mb-4 aspect-square w-full rounded-md" />

      {/* Título */}
      <Skeleton className="mb-2 h-5 w-3/4" />

      {/* Descripción */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      {/* Precio */}
      <Skeleton className="h-6 w-1/3" />

      {/* Botón */}
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  );
}

/**
 * Skeleton para Card de mascota
 */
export function SkeletonPetCard() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Skeleton className="h-16 w-16 shrink-0 rounded-full" />

        <div className="flex-1">
          {/* Nombre */}
          <Skeleton className="mb-2 h-5 w-1/2" />

          {/* Info */}
          <div className="space-y-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  );
}

/**
 * Skeleton para tabla
 */
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex gap-4 border-b pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-8 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton para formulario
 */
interface SkeletonFormProps {
  fields?: number;
}

export function SkeletonForm({ fields = 4 }: SkeletonFormProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          {/* Label */}
          <Skeleton className="h-4 w-1/4" />

          {/* Input */}
          <Skeleton className="h-10 w-full" />
        </div>
      ))}

      {/* Submit button */}
      <Skeleton className="mt-6 h-10 w-full" />
    </div>
  );
}

/**
 * Skeleton para lista de items
 */
interface SkeletonListProps {
  items?: number;
}

export function SkeletonList({ items = 5 }: SkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para página completa
 */
export function SkeletonPage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonProductCard />
        <SkeletonProductCard />
        <SkeletonProductCard />
      </div>
    </div>
  );
}
