import { Dog, Cat, Bird, Rabbit, Rat, PawPrint, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import type { Pet } from '@/pets/types';
import { PetStatsService } from '@/pets/services/PetStatsService';
import type { PetSpecies } from '@/shared/types/enums';

interface RecentPetsWidgetProps {
  pets: Pet[];
  limit?: number;
}

/**
 * Mapeo de especies a iconos de lucide-react
 * SINCRONIZADO CON BACKEND: solo 6 especies válidas
 */
const speciesIcons: Record<PetSpecies, typeof Dog> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  hamster: Rat,
  other: PawPrint,
};

/**
 * Mapeo de especies a nombres en español (singular)
 * SINCRONIZADO CON BACKEND: solo 6 especies válidas
 */
const speciesLabels: Record<PetSpecies, string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  hamster: 'Hamster',
  other: 'Otra especie',
};

/**
 * Formatea una fecha a formato legible en español
 */
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Hoy';
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return 'Hace ' + diffInDays + ' días';
  if (diffInDays < 30) return 'Hace ' + Math.floor(diffInDays / 7) + ' semanas';

  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Widget que muestra las mascotas registradas recientemente
 * Incluye foto, nombre, especie, raza y fecha de registro
 */
export const RecentPetsWidget: React.FC<RecentPetsWidgetProps> = ({
  pets,
  limit = 5,
}) => {
  const recentPets = PetStatsService.getRecentPets(pets, limit);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Mascotas Recientes</h3>
        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      </div>

      {recentPets.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {recentPets.map((pet) => {
            const Icon = speciesIcons[pet.species];
            const speciesLabel = speciesLabels[pet.species];

            return (
              <Link
                key={pet.id}
                to={`/pets/${pet.id}`}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                {/* Avatar / Foto */}
                <div className="relative flex-shrink-0">
                  {pet.profilePhoto ? (
                    <img
                      src={pet.profilePhoto}
                      alt={pet.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-indigo-300 transition-colors"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-gray-200 group-hover:border-indigo-300 transition-colors">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {pet.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <span className="truncate">
                      {speciesLabel}
                      {pet.breed && ` • ${pet.breed}`}
                    </span>
                  </div>
                </div>

                {/* Fecha */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-500">{formatDate(pet.createdAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-6 sm:py-8 text-center">
          <PawPrint className="h-7 w-7 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs sm:text-sm text-gray-500">No hay mascotas registradas aún</p>
        </div>
      )}

      {/* Footer con link a ver todas */}
      {recentPets.length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <Link
            to="/pets"
            className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-1"
          >
            Ver todas las mascotas
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
};
