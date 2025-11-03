import { PawPrint } from "lucide-react";
import { useNavigate } from "react-router";
import {
  AdminTitle,
  AdminListItem,
  PetSearchBar,
  PetStatsWidget,
  RecentPetsWidget,
} from "@/admin/components";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePetsSearch } from "@/pets/hooks";
import type { PetSpecies } from "@/shared/types/enums";

// Species translation map
const SPECIES_LABELS: Record<PetSpecies, string> = {
  dog: "Perro",
  cat: "Gato",
  bird: "Ave",
  rabbit: "Conejo",
  hamster: "Hamster",
  fish: "Pez",
  reptile: "Reptil",
  other: "Otro",
};

/**
 * AdminPetsPage - Pet management interface for admin panel
 *
 * Features:
 * - Search bar for filtering pets by name, breed, or owner
 * - Statistics widgets (total pets, species breakdown)
 * - Recent pets widget
 * - Responsive table/list view:
 *   - Desktop (lg+): Full table with all columns
 *   - Mobile (< lg): Card-based list with AdminListItem
 * - Accessibility: WCAG 2.1 AA compliant
 * - Empty states: No pets, no search results
 * - Loading state: Full screen loader
 * - High contrast and smooth transitions
 * - Clickable rows for navigation (console.log for now)
 *
 * @example
 * <Route path="/admin/pets" element={<AdminPetsPage />} />
 */
export default function AdminPetsPage() {
  const navigate = useNavigate();

  // Use the usePetsSearch hook for data and search functionality
  const { pets, allPets, isLoading, searchQuery, setSearchQuery, summary } = usePetsSearch();

  const handlePetClick = (petId: string) => {
    navigate(`/pets/${petId}`);
  };

  // Format date to Spanish locale
  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get species label in Spanish
  const getSpeciesLabel = (species: PetSpecies): string => {
    return SPECIES_LABELS[species] || species;
  };

  // Loading state
  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminTitle
        title="Mascotas"
        subtitle="Gestiona las mascotas registradas de tus clientes"
      />

      {/* Widgets Grid - Muestra todas las mascotas sin filtrar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <PetStatsWidget pets={allPets} />
        <RecentPetsWidget pets={allPets} />
      </div>

      {/* Search Bar - Justo antes de la lista, solo si hay mascotas */}
      {allPets.length > 0 && (
        <div className="space-y-2">
          <PetSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por nombre o dueño..."
          />
          {/* Search Summary */}
          {summary && (
            <p className="text-sm text-muted-foreground pl-1">{summary}</p>
          )}
        </div>
      )}

      {/* Pets Table/List - Contenedor con altura mínima para evitar saltos */}
      <div className="min-h-[600px]">
        {allPets.length === 0 ? (
          // Empty State - No hay mascotas en el sistema
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <PawPrint
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <CardTitle className="mb-2">
                No hay mascotas registradas
              </CardTitle>
              <CardDescription>
                Las mascotas registradas por los clientes aparecerán aquí.
              </CardDescription>
            </CardContent>
          </Card>
        ) : pets.length === 0 ? (
          // Empty State - Búsqueda sin resultados
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <PawPrint
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <CardTitle className="mb-2">
                No se encontraron mascotas
              </CardTitle>
              <CardDescription>
                No hay resultados para "<strong>{searchQuery}</strong>".
                <br />
                Intenta con otro término de búsqueda.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table View (lg and above) */}
            <div className="hidden lg:block">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Todas las mascotas</CardTitle>
                  <CardDescription>
                    Lista completa de mascotas registradas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Foto</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Especie</TableHead>
                      <TableHead>Raza</TableHead>
                      <TableHead>Dueño</TableHead>
                      <TableHead className="text-right">
                        Fecha registro
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow
                        key={pet.id}
                        onClick={() => handlePetClick(pet.id)}
                        className="cursor-pointer transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        role="button"
                        tabIndex={0}
                        aria-label={`Ver detalles de ${pet.name}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handlePetClick(pet.id);
                          }
                        }}
                      >
                        {/* Photo Column */}
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {pet.profilePhoto ? (
                              <img
                                src={pet.profilePhoto}
                                alt={`Foto de ${pet.name}`}
                                className="w-12 h-12 rounded-full object-cover border-2 border-border"
                              />
                            ) : (
                              <div
                                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border"
                                aria-label="Sin foto"
                              >
                                <PawPrint
                                  className="h-6 w-6 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Name Column */}
                        <TableCell className="font-medium">{pet.name}</TableCell>

                        {/* Species Column */}
                        <TableCell>{getSpeciesLabel(pet.species)}</TableCell>

                        {/* Breed Column */}
                        <TableCell className="text-muted-foreground">
                          {pet.breed || "No especificada"}
                        </TableCell>

                        {/* Owner Column */}
                        <TableCell>
                          {pet.owner?.fullName || "Sin dueño"}
                        </TableCell>

                        {/* Date Column */}
                        <TableCell className="text-right text-muted-foreground">
                          {formatDate(pet.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile List View (below lg) */}
          <div className="lg:hidden space-y-3">
            {pets.map((pet) => (
              <AdminListItem
                key={pet.id}
                onClick={() => handlePetClick(pet.id)}
                title={pet.name}
                subtitle={pet.owner?.fullName || "Sin dueño"}
                badge={
                  <div className="flex items-center justify-center">
                    {pet.profilePhoto ? (
                      <img
                        src={pet.profilePhoto}
                        alt={`Foto de ${pet.name}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border"
                        aria-label="Sin foto"
                      >
                        <PawPrint
                          className="h-6 w-6 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                }
                metadata={[
                  {
                    label: "Especie",
                    value: getSpeciesLabel(pet.species),
                  },
                  {
                    label: "Raza",
                    value: pet.breed || "No especificada",
                  },
                  {
                    label: "Registro",
                    value: formatDate(pet.createdAt),
                  },
                ]}
              />
            ))}
          </div>
        </>
        )}
      </div>
    </div>
  );
}
