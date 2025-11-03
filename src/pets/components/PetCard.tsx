import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { Pet } from '../types';
import { PetAgeCalculatorService } from '../services';
import { PetAvatar } from './PetAvatar';
import { TemperamentBadge } from './TemperamentBadge';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
  onViewProfile?: () => void;
}

export function PetCard({ pet, onClick, onViewProfile }: PetCardProps) {
  const age = PetAgeCalculatorService.getFormattedAge(pet.birthDate);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-2">
          <PetAvatar pet={pet} size="md" />
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1 text-center">
            <h3 className="text-base sm:text-lg font-semibold font-pet-name truncate px-1">{pet.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground capitalize truncate px-1">
              {pet.breed || pet.species}
            </p>
          </div>
          <TemperamentBadge temperament={pet.temperament} className="absolute top-3 sm:top-4 right-3 sm:right-4" />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Edad:</span>
            <span className="font-medium">{age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Género:</span>
            <span className="font-medium capitalize">{pet.gender}</span>
          </div>
          {pet.weight && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peso:</span>
              <span className="font-medium">{pet.weight} kg</span>
            </div>
          )}

          {onViewProfile && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 sm:mt-2 text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile();
              }}
              aria-label={`Ver perfil completo de ${pet.name}`}
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Ver Perfil Completo</span>
              <span className="sm:hidden">Ver Perfil</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
