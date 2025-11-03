import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { Pet } from '../types';
import { PetAvatar } from './PetAvatar';

interface ImageZoomModalProps {
  open: boolean;
  onClose: () => void;
  pet: Pet;
}

/**
 * Modal para mostrar la foto de perfil de la mascota ampliada
 */
export function ImageZoomModal({ open, onClose, pet }: ImageZoomModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative w-full aspect-square bg-muted">
          {pet.profilePhoto ? (
            <img
              src={pet.profilePhoto}
              alt={`Foto de ${pet.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PetAvatar pet={pet} size="lg" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
