import { Link, useLocation } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CustomLogo } from '@/components/custom/CustomLogo';
import { useAuthStore } from '@/auth/store/auth.store';
import { ADMIN_NAVIGATION_LINKS } from '@/admin/config/navigation.config';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
}) => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  const isActiveRoute = (to?: string) => {
    if (!to) return false;

    // Caso especial para productos que incluye rutas anidadas
    if (pathname.includes('/admin/products') && to === '/admin/products') {
      return true;
    }

    return pathname === to;
  };

  return (
    <div
      className={`hidden md:flex bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-18' : 'w-64'
      } flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between h-18">
        {!isCollapsed && <CustomLogo />}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" aria-label="Navegación principal de administración">
        <ul className="space-y-2">
          {ADMIN_NAVIGATION_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.to);

            return (
              <li key={item.label}>
                <Link
                  to={item.to || '/admin'}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  title={isCollapsed ? item.label : item.description}
                >
                  <Icon size={20} className="flex-shrink-0" aria-hidden="true" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
              aria-hidden="true"
            >
              {user.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
