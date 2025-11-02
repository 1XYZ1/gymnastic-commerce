import { AdminTitle } from "@/admin/components/AdminTitle";
import { ProductImageCell } from "@/admin/components/ProductImageCell";
import { AdminListItem } from "@/admin/components";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { currencyFormatter } from "@/lib/currency-formatter";
import { useAdminProducts } from "@/admin/hooks/useAdminProducts";
import { PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";

/**
 * Determina la variante del badge de stock según la cantidad disponible
 * - destructive: Menos de 10 unidades (stock crítico)
 * - warning: Entre 10 y 29 unidades (stock bajo)
 * - default: 30 o más unidades (stock normal)
 */
const getStockBadgeVariant = (stock: number): "destructive" | "warning" | "default" => {
  if (stock < 10) return "destructive";
  if (stock < 30) return "warning";
  return "default";
};

export const AdminProductsPage = () => {
  const { data, isLoading } = useAdminProducts();
  const navigate = useNavigate();

  // Handler para navegar al detalle del producto
  const handleProductClick = (productId: string) => {
    navigate(`/admin/products/${productId}`);
  };

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle
          title="Productos"
          subtitle="Aquí puedes ver y administrar tus productos"
        />

        <div className="flex justify-end mb-10 gap-4">
          <Link to="/admin/products/new">
            <Button>
              <PlusIcon />
              Nuevo producto
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop: Tabla con filas clickeables */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <Table className="bg-white p-10 shadow-xs border border-gray-200 mb-10" aria-label="Tabla de productos">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Imagen</TableHead>
                <TableHead scope="col">Nombre</TableHead>
                <TableHead scope="col">Precio</TableHead>
                <TableHead scope="col">Categoría</TableHead>
                <TableHead scope="col">Inventario</TableHead>
                <TableHead scope="col">Tallas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data!.products.map((product) => (
                <TableRow
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  aria-label={`Ver detalles de ${product.title}`}
                >
                  <TableCell>
                    <ProductImageCell
                      src={product.images[0]}
                      alt={`Imagen del producto ${product.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.title}
                  </TableCell>
                  <TableCell>{currencyFormatter(product.price)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge variant={getStockBadgeVariant(product.stock)}>
                      {product.stock} stock
                    </Badge>
                  </TableCell>
                  <TableCell>{product.sizes.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Móvil: AdminListItem */}
      <div className="md:hidden space-y-3 mb-10">
        {data!.products.map((product) => (
          <AdminListItem
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            title={product.title}
            subtitle={product.category}
            badge={
              <Badge variant={getStockBadgeVariant(product.stock)}>
                {product.stock}
              </Badge>
            }
            metadata={[
              {
                label: "Precio",
                value: currencyFormatter(product.price),
              },
              {
                label: "Tallas",
                value: product.sizes.join(", "),
              },
              {
                label: "Slug",
                value: product.slug,
              },
            ]}
          />
        ))}
      </div>

      <CustomPagination totalPages={data?.pages || 0} />
    </>
  );
};
