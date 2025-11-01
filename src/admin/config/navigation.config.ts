import {
  Home,
  Users,
  BarChart3,
  Settings,
  FileText,
  ShoppingCart,
  Bell,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavigationLink {
  icon: LucideIcon;
  label: string;
  to?: string;
  description?: string;
}

/**
 * Enlaces de navegación principal del panel de administración
 * Estos enlaces se muestran en el sidebar y en el menú móvil
 */
export const ADMIN_NAVIGATION_LINKS: AdminNavigationLink[] = [
  {
    icon: Home,
    label: 'Dashboard',
    to: '/admin',
    description: 'Vista general y estadísticas',
  },
  {
    icon: BarChart3,
    label: 'Productos',
    to: '/admin/products',
    description: 'Gestión de productos',
  },
  {
    icon: Users,
    label: 'Usuarios',
    description: 'Administración de usuarios',
  },
  {
    icon: ShoppingCart,
    label: 'Ordenes',
    description: 'Gestión de pedidos',
  },
  {
    icon: FileText,
    label: 'Reportes',
    description: 'Informes y análisis',
  },
  {
    icon: Bell,
    label: 'Notificaciones',
    description: 'Centro de notificaciones',
  },
  {
    icon: Settings,
    label: 'Ajustes',
    description: 'Configuración del sistema',
  },
  {
    icon: HelpCircle,
    label: 'Ayuda',
    description: 'Soporte y documentación',
  },
];
