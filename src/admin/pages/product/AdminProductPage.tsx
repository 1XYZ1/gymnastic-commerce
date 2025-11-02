// https://github.com/Klerith/bolt-product-editor
import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { useProduct } from '@/admin/hooks/useProduct';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { ProductForm } from './ui/ProductForm';
import type { Product } from '@/shared/types';

export const AdminProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, data: product, mutation } = useProduct(id || '');

  const title = id === 'new' ? 'Nuevo producto' : 'Editar producto';
  const subtitle =
    id === 'new'
      ? 'Aquí puedes crear un nuevo producto.'
      : 'Aquí puedes editar el producto.';

  const handleSubmit = async (
    productLike: Partial<Product> & { files?: File[] }
  ) => {
    try {
      await mutation.mutateAsync(productLike);

      // Mostrar mensaje de éxito
      const message = id === 'new'
        ? 'Producto creado correctamente'
        : 'Producto actualizado correctamente';

      toast.success(message, {
        position: 'top-right',
      });

      // Navegar a la lista de productos
      navigate('/admin/products');
    } catch (error) {
      console.error('Error al guardar el producto:', error);

      const errorMessage = id === 'new'
        ? 'Error al crear el producto'
        : 'Error al actualizar el producto';

      toast.error(errorMessage, {
        position: 'top-right',
      });
    }
  };

  if (isError) {
    return <Navigate to="/admin/products" />;
  }

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  if (!product) {
    return <Navigate to="/admin/products" />;
  }

  return (
    <ProductForm
      title={title}
      subTitle={subtitle}
      product={product}
      onSubmit={handleSubmit}
      isPending={mutation.isPending}
    />
  );
};
