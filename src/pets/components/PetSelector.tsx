import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Pet } from '../types';
import { PetCard } from './PetCard';

interface PetSelectorProps {
  pets: Pet[];
  selectedPetIds: string[];
  onSelectionChange: (petIds: string[]) => void;
}

export function PetSelector({ pets, selectedPetIds, onSelectionChange }: PetSelectorProps) {
  const handleTogglePet = (petId: string) => {
    const isSelected = selectedPetIds.includes(petId);
    if (isSelected) {
      onSelectionChange(selectedPetIds.filter((id) => id !== petId));
    } else {
      onSelectionChange([...selectedPetIds, petId]);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Selecciona las mascotas para esta cita:</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="relative">
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                id={`pet-${pet.id}`}
                checked={selectedPetIds.includes(pet.id)}
                onCheckedChange={() => handleTogglePet(pet.id)}
                aria-label={`Seleccionar ${pet.name}`}
              />
            </div>
            <div
              className={`transition-all ${
                selectedPetIds.includes(pet.id) ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <PetCard pet={pet} onClick={() => handleTogglePet(pet.id)} />
            </div>
          </div>
        ))}
      </div>
      {pets.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No tienes mascotas registradas. Crea una primero.
        </p>
      )}
    </div>
  );
}
