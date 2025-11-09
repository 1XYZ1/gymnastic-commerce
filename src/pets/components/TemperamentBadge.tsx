import { Badge } from '@/components/ui/badge';
import type { PetTemperament } from '@/shared/types/enums';
import { cn } from '@/lib/utils';

interface TemperamentBadgeProps {
  temperament: PetTemperament;
  className?: string;
}

const temperamentConfig: Record<PetTemperament, { label: string; className: string }> = {
  friendly: { label: 'Amigable', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  aggressive: { label: 'Agresivo', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  calm: { label: 'Tranquilo', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  nervous: { label: 'Nervioso', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  shy: { label: 'Tímido', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  playful: { label: 'Juguetón', className: 'bg-pink-100 text-pink-800 hover:bg-pink-100' },
  energetic: { label: 'Energético', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  unknown: { label: 'Desconocido', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
};

export function TemperamentBadge({ temperament, className }: TemperamentBadgeProps) {
  const config = temperamentConfig[temperament];

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
