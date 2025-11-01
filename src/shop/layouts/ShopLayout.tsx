import { Outlet, ScrollRestoration } from 'react-router';
import { CustomHeader } from '../components/CustomHeader';
import { CustomFooter } from '../components/CustomFooter';

export const ShopLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <CustomHeader />

      {/* Restaura automáticamente la posición del scroll al navegar entre páginas */}
      <ScrollRestoration />

      <main id="main-content">
        <Outlet />
      </main>

      <CustomFooter />
    </div>
  );
};
