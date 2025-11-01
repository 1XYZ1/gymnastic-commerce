import { useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  totalPages: number;
}

export const CustomPagination = ({ totalPages }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') || '1';
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    searchParams.set('page', page.toString());

    setSearchParams(searchParams);
  };

  return (
    <nav aria-label="Navegación de paginación" role="navigation">
      <div className="flex items-center justify-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          aria-label="Ir a la página anterior"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Anteriores
        </Button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index}
            type="button"
            variant={page === index + 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(index + 1)}
            aria-label={`Ir a la página ${index + 1}`}
            aria-current={page === index + 1 ? 'page' : undefined}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          aria-label="Ir a la página siguiente"
        >
          Siguientes
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Página {page} de {totalPages}
      </div>
    </nav>
  );
};
