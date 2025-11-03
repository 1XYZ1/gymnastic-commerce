import { cn } from '@/lib/utils';
import type { Pet } from '../types';

interface PetAvatarProps {
  pet: Pet;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Generates a consistent color based on a string hash
 * This ensures the same name always gets the same color
 */
function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Array of pleasant, accessible colors with good contrast
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-rose-500',
    'bg-cyan-500',
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Extracts initials from a pet's name
 * Examples: "Max" -> "M", "Luna Bella" -> "LB", "Mr. Whiskers" -> "MW"
 */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  // Take first letter of first two words
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

/**
 * PetAvatar Component
 *
 * Displays a pet's profile photo if available, or generates an avatar with initials
 * The avatar has a consistent color based on the pet's name
 *
 * @param pet - The pet object containing name and profilePhoto
 * @param size - Size variant: 'sm' (40px), 'md' (80px), 'lg' (160px)
 * @param className - Additional CSS classes to apply
 */
export function PetAvatar({ pet, size = 'md', className }: PetAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-40 h-40 text-5xl',
  };

  const bgColor = getColorFromName(pet.name);
  const initials = getInitials(pet.name);

  if (pet.profilePhoto) {
    return (
      <img
        src={pet.profilePhoto}
        alt={`Foto de ${pet.name}`}
        className={cn(
          'rounded-full object-cover border-2 border-border',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white',
        bgColor,
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={`Avatar de ${pet.name}`}
    >
      {initials}
    </div>
  );
}
