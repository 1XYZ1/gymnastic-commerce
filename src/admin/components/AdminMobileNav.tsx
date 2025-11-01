import { useState, useRef, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, Search, LogOut, Store, User, ShieldCheck } from 'lucide-react';

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
import { ADMIN_NAVIGATION_LINKS } from '@/admin/config/navigation.config';

export const AdminMobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Maneja la búsqueda cuando el usuario presiona Enter
   * Navega a la página de productos con el query string
   */
  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const query = inputRef.current?.value;

    if (!query) {
      navigate('/admin/products');
    } else {
      navigate(`/admin/products?query=${query}`);
    }

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
    navigate('/auth/login');
  };

  /**
   * Determina si una ruta está activa
   */
  const isActiveRoute = (to?: string) => {
    if (!to) return false;

    // Caso especial para productos que incluye rutas anidadas
    if (pathname.includes('/admin/products') && to === '/admin/products') {
      return true;
    }

    return pathname === to;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Botón hamburguesa - Solo visible en móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú de administración"
        aria-expanded={isOpen}
        aria-controls="admin-mobile-navigation"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">Abrir menú</span>
      </Button>

      {/* Contenido del Sheet - Menú lateral izquierdo */}
      <SheetContent
        side="left"
        className="w-[85vw] sm:w-[350px] p-0"
        id="admin-mobile-navigation"
        aria-label="Menú de administración móvil"
      >
        {/* Header del menú */}
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
            <SheetTitle className="text-2xl font-bold text-left">
              Panel Admin
            </SheetTitle>
          </div>
          <SheetDescription className="text-left text-muted-foreground">
            Gestión y administración del sistema
          </SheetDescription>
        </SheetHeader>

        <Separator className="mb-4" />

        {/* Contenido scrollable */}
        <div className="flex flex-col h-[calc(100vh-120px)] overflow-y-auto px-6">
          {/* Barra de búsqueda móvil */}
          <div className="mb-6">
            <label htmlFor="admin-mobile-search" className="sr-only">
              Buscar productos
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="admin-mobile-search"
                ref={inputRef}
                placeholder="Buscar productos..."
                className="pl-10 h-11 bg-white"
                onKeyDown={handleSearch}
                aria-label="Campo de búsqueda de productos"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-1">
              Presiona Enter para buscar
            </p>
          </div>

          <Separator className="mb-4" />

          {/* Links de navegación principal */}
          <nav aria-label="Navegación de administración" className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Menú Principal
            </h3>
            <ul className="space-y-1" role="list">
              {ADMIN_NAVIGATION_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveRoute(link.to);

                return (
                  <li key={link.label}>
                    <SheetClose asChild>
                      <Link
                        to={link.to || '/admin'}
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
                        title={link.description}
                      >
                        <Icon
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

          {/* Sección de usuario y acciones */}
          <div className="mt-auto pb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Cuenta
            </h3>

            <div className="space-y-2">
              {/* Información del usuario */}
              {user && (
                <div className="px-3 py-3 bg-muted rounded-lg mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {user.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User
                          className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0"
                          aria-hidden="true"
                        />
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.fullName}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón Volver al Shop */}
              <SheetClose asChild>
                <Link to="/" onClick={handleLinkClick}>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    aria-label="Volver a la tienda"
                  >
                    <Store className="h-5 w-5" aria-hidden="true" />
                    <span className="text-base">Volver al Shop</span>
                  </Button>
                </Link>
              </SheetClose>

              {/* Botón de Logout */}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start gap-3 h-12"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                <span className="text-base">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
