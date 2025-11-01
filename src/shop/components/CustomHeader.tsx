import { useRef, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useParams, useSearchParams } from 'react-router';
import { cn } from '@/lib/utils';
import { CustomLogo } from '@/components/custom/CustomLogo';

import { useAuthStore } from '@/auth/store/auth.store';
import { NAVIGATION_LINKS } from '@/shop/config/navigation.config';
import { MobileNav } from './MobileNav';

export const CustomHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { authStatus, isAdmin, logout } = useAuthStore();

  const { gender } = useParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get('query') || '';

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    const query = inputRef.current?.value;

    const newSearchParams = new URLSearchParams();

    if (!query) {
      newSearchParams.delete('query');
    } else {
      newSearchParams.set('query', inputRef.current!.value);
    }

    setSearchParams(newSearchParams);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-slate-50/95 supports-[backdrop-filter]:bg-slate-50/80">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Navigation - Solo visible en móvil */}
          <div className="md:hidden">
            <MobileNav />
          </div>

          {/* Logo - Centrado en móvil, izquierda en desktop */}
          <div className="flex-shrink-0 md:mr-8">
            <CustomLogo />
          </div>

          {/* Navigation - Desktop Only */}
          <nav
            className="hidden md:flex items-center space-x-6 lg:space-x-8"
            aria-label="Navegación principal"
          >
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1',
                  (link.gender === gender || (!gender && !link.gender)) &&
                    'text-primary underline underline-offset-4 decoration-2'
                )}
                aria-current={
                  link.gender === gender || (!gender && !link.gender)
                    ? 'page'
                    : undefined
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search - Desktop: Centrado y espaciado */}
          <div className="hidden md:flex flex-1 justify-center max-w-md mx-6 lg:mx-8">
            <div className="relative w-full">
              <label htmlFor="desktop-search" className="sr-only">
                Buscar productos
              </label>
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="desktop-search"
                ref={inputRef}
                placeholder="Buscar productos..."
                className="pl-9 w-full h-9 bg-white focus:ring-2 focus:ring-primary"
                onKeyDown={handleSearch}
                defaultValue={query}
                aria-label="Campo de búsqueda de productos"
              />
            </div>
          </div>

          {/* Actions - Desktop: Agrupados con espaciado generoso */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">

            {/* Auth Buttons */}
            {authStatus === 'not-authenticated' ? (
              <Link to="/auth/login">
                <Button
                  variant="default"
                  size="sm"
                  aria-label="Iniciar sesión"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            ) : (
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                aria-label="Cerrar sesión"
              >
                Cerrar Sesión
              </Button>
            )}

            {/* Admin Button */}
            {isAdmin() && (
              <Link to="/admin">
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  aria-label="Ir al panel de administración"
                >
                  Admin
                </Button>
              </Link>
            )}
          </div>

          {/* Spacer para mantener el logo centrado en móvil */}
          <div className="w-10 md:hidden" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
};
