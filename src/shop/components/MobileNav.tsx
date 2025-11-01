import { useState, useRef, type KeyboardEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { Menu, Search, LogIn, LogOut, ShieldCheck, Home, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { useAuthStore } from '@/auth/store/auth.store';
import { NAVIGATION_LINKS } from '@/shop/config/navigation.config';

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { authStatus, isAdmin, logout } = useAuthStore();
  const { gender } = useParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get('query') || '';

  /**
   * Maneja la búsqueda cuando el usuario presiona Enter
   * Actualiza los parámetros de búsqueda y cierra el menú
   */
  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const query = inputRef.current?.value;
    const newSearchParams = new URLSearchParams();

    if (query) {
      newSearchParams.set('query', query);
    }

    setSearchParams(newSearchParams);
    setIsOpen(false); // Cierra el menú después de buscar
  };

  /**
   * Cierra el menú al hacer clic en un enlace de navegación
   */
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  /**
   * Maneja el logout y cierra el menú
   */
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Botón hamburguesa - Solo visible en móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">Abrir menú</span>
      </Button>

      {/* Contenido del Sheet - Menú lateral izquierdo */}
      <SheetContent
        side="left"
        className="w-[85vw] sm:w-[350px] p-0"
        id="mobile-navigation"
        aria-label="Menú de navegación móvil"
      >
        {/* Header del menú */}
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-2xl font-bold text-left">
            Gym Shop
          </SheetTitle>
          <SheetDescription className="text-left text-muted-foreground">
            Encuentra todo para tu entrenamiento
          </SheetDescription>
        </SheetHeader>

        <Separator className="mb-4" />

        {/* Contenido scrollable */}
        <div className="flex flex-col h-[calc(100vh-120px)] overflow-y-auto px-6">
          {/* Barra de búsqueda móvil */}
          <div className="mb-6">
            <label htmlFor="mobile-search" className="sr-only">
              Buscar productos
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="mobile-search"
                ref={inputRef}
                placeholder="Buscar productos..."
                className="pl-10 h-11 bg-white"
                onKeyDown={handleSearch}
                defaultValue={query}
                aria-label="Campo de búsqueda de productos"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-1">
              Presiona Enter para buscar
            </p>
          </div>

          <Separator className="mb-4" />

          {/* Links de navegación principal */}
          <nav aria-label="Navegación principal" className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Categorías
            </h3>
            <ul className="space-y-1" role="list">
              {NAVIGATION_LINKS.map((link) => {
                const isActive =
                  link.gender === gender || (!gender && !link.gender);

                return (
                  <li key={link.path}>
                    <SheetClose asChild>
                      <Link
                        to={link.path}
                        onClick={handleLinkClick}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200',
                          'hover:bg-primary/10 hover:text-primary',
                          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                          'active:scale-95',
                          isActive &&
                            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Home
                          className="h-5 w-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{link.label}</span>
                      </Link>
                    </SheetClose>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Separator className="mb-4" />

          {/* Sección de autenticación y admin */}
          <div className="mt-auto pb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Cuenta
            </h3>

            <div className="space-y-2">
              {/* Botón Admin - Solo visible para administradores */}
              {isAdmin() && (
                <SheetClose asChild>
                  <Link to="/admin" onClick={handleLinkClick}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-12"
                      aria-label="Ir al panel de administración"
                    >
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                      <span className="text-base">Panel Admin</span>
                    </Button>
                  </Link>
                </SheetClose>
              )}

              {/* Botones de autenticación */}
              {authStatus === 'not-authenticated' ? (
                <SheetClose asChild>
                  <Link to="/auth/login" onClick={handleLinkClick}>
                    <Button
                      variant="default"
                      className="w-full justify-start gap-3 h-12"
                      aria-label="Iniciar sesión"
                    >
                      <LogIn className="h-5 w-5" aria-hidden="true" />
                      <span className="text-base">Iniciar Sesión</span>
                    </Button>
                  </Link>
                </SheetClose>
              ) : (
                <>
                  <div className="px-3 py-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <User
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <p className="text-sm text-muted-foreground">
                        Sesión iniciada
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 h-12"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-5 w-5" aria-hidden="true" />
                    <span className="text-base">Cerrar Sesión</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
