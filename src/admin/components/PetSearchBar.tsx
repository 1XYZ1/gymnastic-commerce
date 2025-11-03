import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PetSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * PetSearchBar - Accessible search input component for pet filtering
 *
 * Features:
 * - Search icon on the left for visual clarity
 * - Clear button (X) on the right that appears when there's text
 * - Full keyboard accessibility (type="search", autoComplete="off")
 * - Responsive: full-width on mobile, constrained on desktop
 * - WCAG 2.1 AA compliant with proper ARIA labels
 * - Smooth transitions for enhanced UX
 *
 * @example
 * <PetSearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Buscar por nombre, raza o dueño..."
 * />
 */
export function PetSearchBar({
  value,
  onChange,
  placeholder = "Buscar mascotas...",
  className,
}: PetSearchBarProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div
      className={cn(
        // Responsive width: full on mobile, constrained on desktop
        "w-full max-w-2xl relative",
        className
      )}
    >
      {/* Search Icon - Left */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />

      {/* Search Input */}
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Buscar mascotas"
        className={cn(
          // Height 48px for better touch targets
          "h-12",
          // Padding: left for icon, right for clear button
          "pl-10 pr-10",
          // Smooth transitions
          "transition-colors duration-200"
        )}
      />

      {/* Clear Button - Right (only visible when there's text) */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className={cn(
            // Positioning
            "absolute right-3 top-1/2 -translate-y-1/2",
            // Size and appearance
            "h-5 w-5 rounded-sm",
            // Interactive states
            "text-muted-foreground hover:text-foreground",
            "transition-colors duration-200",
            // Focus state for accessibility
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
