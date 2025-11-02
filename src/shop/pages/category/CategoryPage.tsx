import { CustomPagination } from '@/components/custom/CustomPagination';
import { CustomJumbotron } from '@/shop/components/CustomJumbotron';
import { ProductsGrid } from '@/shop/components/ProductsGrid';
import { useProducts } from '@/shop/hooks/useProducts';
import { useParams } from 'react-router';
import { getCategoryLabel } from '@/shop/config/navigation.config';

export const CategoryPage = () => {
  const { category } = useParams();
  const { data } = useProducts();

  const categoryLabel = getCategoryLabel(category || null);

  return (
    <>
      <CustomJumbotron title={`Productos para ${categoryLabel}`} />

      <ProductsGrid products={data?.products || []} />

      <CustomPagination totalPages={data?.pages || 1} />
    </>
  );
};
