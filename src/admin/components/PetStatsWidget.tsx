import { Dog, Cat, Bird, Rabbit, Rat, PawPrint, TrendingUp } from 'lucide-react';
import type { Pet } from '@/pets/types';
import { PetStatsService } from '@/pets/services/PetStatsService';
import type { PetSpecies } from '@/shared/types/enums';

interface PetStatsWidgetProps {
  pets: Pet[];
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
  hamster: Rat, // Usamos Rat como aproximación para hamster
  other: PawPrint,
};

/**
 * Mapeo de especies a colores (Tailwind classes)
 * SINCRONIZADO CON BACKEND: solo 6 especies válidas
 */
const speciesColors: Record<PetSpecies, string> = {
  dog: 'bg-amber-500',
  cat: 'bg-purple-500',
  bird: 'bg-sky-500',
  rabbit: 'bg-pink-500',
  hamster: 'bg-orange-500',
  other: 'bg-gray-500',
};

/**
 * Mapeo de especies a nombres en español
 * SINCRONIZADO CON BACKEND: solo 6 especies válidas
 */
const speciesLabels: Record<PetSpecies, string> = {
  dog: 'Perros',
  cat: 'Gatos',
  bird: 'Aves',
  rabbit: 'Conejos',
  hamster: 'Hamsters',
  other: 'Otros',
};

/**
 * Widget que muestra estadísticas generales de mascotas
 * Incluye total de mascotas y distribución por especies
 */
export const PetStatsWidget: React.FC<PetStatsWidgetProps> = ({ pets }) => {
  const totalPets = PetStatsService.getTotalPets(pets);
  const distribution = PetStatsService.getPetsBySpecies(pets);
  const petsWithoutPhoto = PetStatsService.getPetsWithoutPhoto(pets);

  // Ordenar distribución por cantidad (descendente)
  const sortedDistribution = [...distribution].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Mascotas Registradas</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Distribución por especies</p>
        </div>
        <div className="p-2 sm:p-3 rounded-lg bg-indigo-500 flex-shrink-0">
          <PawPrint className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>

      {/* Total de mascotas */}
      <div className="mb-4 sm:mb-6">
        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{totalPets}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            {petsWithoutPhoto} sin foto
          </div>
        </div>
      </div>

      {/* Distribución por especies */}
      {sortedDistribution.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Por especies:</p>
          {sortedDistribution.map(({ species, count, percentage }) => {
            const Icon = speciesIcons[species];
            const color = speciesColors[species];
            const label = speciesLabels[species];

            return (
              <div key={species} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${color} flex-shrink-0`}>
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{label}</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 ml-2 flex-shrink-0">{count}</span>
                    </div>
                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 w-8 sm:w-10 text-right flex-shrink-0">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay mascotas registradas aún
        </p>
      )}
    </div>
  );
};
