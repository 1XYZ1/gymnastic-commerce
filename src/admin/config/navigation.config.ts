import {
  // Home,
  // Users,
  BarChart3,
  // Settings,
  // FileText,
  // ShoppingCart,
  // Bell,
  // HelpCircle,
  Calendar,
  Briefcase,
  PawPrint,
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
 *
 * Nota: Solo se muestran las opciones esenciales. Las demás están comentadas
 * para ser habilitadas en el futuro según sea necesario.
 */
export const ADMIN_NAVIGATION_LINKS: AdminNavigationLink[] = [
  // {
  //   icon: Home,
  //   label: 'Dashboard',
  //   to: '/admin',
  //   description: 'Vista general y estadísticas',
  // },
  {
    icon: BarChart3,
    label: 'Productos',
    to: '/admin/products',
    description: 'Gestión de productos',
  },
  {
    icon: Briefcase,
    label: 'Servicios',
    to: '/admin/services',
    description: 'Gestión de servicios',
  },
  {
    icon: Calendar,
    label: 'Agendas de clientes',
    to: '/admin/appointments',
    description: 'Gestión de citas de clientes',
  },
  {
    icon: PawPrint,
    label: 'Mascotas',
    to: '/admin/pets',
    description: 'Gestión de mascotas de clientes',
  },
  // {
  //   icon: Users,
  //   label: 'Usuarios',
  //   description: 'Administración de usuarios',
  // },
  // {
  //   icon: ShoppingCart,
  //   label: 'Ordenes',
  //   description: 'Gestión de pedidos',
  // },
  // {
  //   icon: FileText,
  //   label: 'Reportes',
  //   description: 'Informes y análisis',
  // },
  // {
  //   icon: Bell,
  //   label: 'Notificaciones',
  //   description: 'Centro de notificaciones',
  // },
  // {
  //   icon: Settings,
  //   label: 'Ajustes',
  //   description: 'Configuración del sistema',
  // },
  // {
  //   icon: HelpCircle,
  //   label: 'Ayuda',
  //   description: 'Soporte y documentación',
  // },
];
