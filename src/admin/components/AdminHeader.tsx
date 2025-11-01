import React, { useRef, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { Search, Bell, MessageSquare, Settings } from 'lucide-react';

import { AdminMobileNav } from './AdminMobileNav';
import { useAuthStore } from '@/auth/store/auth.store';

export const AdminHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const query = inputRef.current?.value;

    if (!query) {
      navigate('/admin/products');
      return;
    }

    navigate(`/admin/products?query=${query}`);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 h-18">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Navigation - Solo visible en móvil */}
        <AdminMobileNav />

        {/* Search - Oculto en móvil pequeño, visible desde sm */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              ref={inputRef}
              onKeyDown={handleSearch}
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Actions - Iconos reducidos en móvil */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notificaciones"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <button
            className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Mensajes"
          >
            <MessageSquare size={20} />
          </button>

          <button
            className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Configuración"
          >
            <Settings size={20} />
          </button>

          {/* Avatar del usuario */}
          <div
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-lg transition-shadow"
            title={user?.fullName || 'Usuario'}
            aria-label={`Perfil de ${user?.fullName || 'usuario'}`}
          >
            {user?.fullName.substring(0, 2).toUpperCase() || 'JD'}
          </div>
        </div>
      </div>
    </header>
  );
};
