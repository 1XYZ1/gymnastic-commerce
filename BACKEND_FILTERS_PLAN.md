# Plan de Implementación: Filtros de Productos Backend

**Stack:** NestJS 10.3.8 + TypeORM + PostgreSQL
**Arquitectura:** Clean Architecture + Repository Pattern

## Análisis de Requisitos

El frontend envía los siguientes parámetros al endpoint `GET /products`:

- `limit` (number): Cantidad de items por página
- `offset` (number): Desplazamiento para paginación
- `q` (string): Búsqueda por texto (título, descripción)
- `gender` (string): Filtro por género (men, women, kid, unisex)
- `sizes` (string): Filtro por tallas (XS, S, M, L, XL, etc.)
- `minPrice` (number): Precio mínimo
- `maxPrice` (number): Precio máximo

---

## Estructura de Archivos

```
src/products/
├── dto/
│   ├── find-products-query.dto.ts    # Nuevo: DTO de validación
├── entities/
│   └── product.entity.ts             # Modificar: asegurar relaciones
├── controllers/
│   └── products.controller.ts        # Modificar: agregar query params
├── services/
│   └── products.service.ts           # Modificar: lógica de filtrado
└── repositories/
    └── products.repository.ts        # Nuevo (opcional): QueryBuilder
```

---

## Paso 1: DTO de Validación

**Archivo:** `src/products/dto/find-products-query.dto.ts`

```typescript
import { IsOptional, IsInt, Min, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  sizes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
```

**Principios aplicados:**
- Validación con class-validator
- Transformación automática de tipos
- Valores por defecto para paginación
- Inmutabilidad mediante readonly (opcional)

---

## Paso 2: Actualizar Controlador

**Archivo:** `src/products/controllers/products.controller.ts`

```typescript
@Get()
findAll(@Query() query: FindProductsQueryDto) {
  return this.productsService.findAllFiltered(query);
}
```

**Consideraciones:**
- Habilitar `ValidationPipe` globalmente en `main.ts`:
  ```typescript
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }));
  ```

---

## Paso 3: Lógica de Servicio

**Archivo:** `src/products/services/products.service.ts`

```typescript
async findAllFiltered(query: FindProductsQueryDto) {
  const { limit, offset, q, gender, sizes, minPrice, maxPrice } = query;

  // QueryBuilder para filtros dinámicos
  const queryBuilder = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.images', 'images')
    .take(limit)
    .skip(offset);

  // Búsqueda por texto (título o descripción)
  if (q) {
    queryBuilder.andWhere(
      '(LOWER(product.title) LIKE :search OR LOWER(product.description) LIKE :search)',
      { search: `%${q.toLowerCase()}%` }
    );
  }

  // Filtro por género
  if (gender) {
    queryBuilder.andWhere('product.gender = :gender', { gender });
  }

  // Filtro por tallas (contiene al menos una)
  if (sizes) {
    const sizeArray = sizes.split(',').map(s => s.trim());
    queryBuilder.andWhere('product.sizes && :sizes', { sizes: sizeArray });
  }

  // Filtro por rango de precios
  if (minPrice !== undefined) {
    queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
  }
  if (maxPrice !== undefined) {
    queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
  }

  // Ejecutar query y contar total
  const [products, total] = await queryBuilder.getManyAndCount();

  return {
    products,
    total,
    limit,
    offset,
  };
}
```

**Principios aplicados:**
- QueryBuilder para queries dinámicas
- Prevención de SQL injection con parámetros
- Eager loading de relaciones necesarias
- Retorno estructurado con metadatos de paginación

---

## Paso 4: Optimización de Base de Datos

**Archivo:** `src/products/entities/product.entity.ts`

```typescript
@Entity('products')
@Index(['gender'])        // Índice para filtro por género
@Index(['price'])         // Índice para filtro por precio
@Index(['title'])         // Índice para búsqueda de texto
export class Product {
  // ... campos existentes

  @Column({ type: 'varchar', array: true })
  sizes: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar' })
  gender: string;
}
```

**Índices recomendados:**
- Índice compuesto: `CREATE INDEX idx_gender_price ON products(gender, price);`
- Índice GIN para búsqueda de texto: `CREATE INDEX idx_title_trgm ON products USING gin(title gin_trgm_ops);`
- Índice GIN para arrays: `CREATE INDEX idx_sizes_gin ON products USING gin(sizes);`

---

## Paso 5: Testing

**Archivo:** `src/products/products.service.spec.ts`

```typescript
describe('ProductsService - findAllFiltered', () => {
  it('debe aplicar filtro de búsqueda por texto', async () => {
    const query = { limit: 10, offset: 0, q: 'nike' };
    const result = await service.findAllFiltered(query);
    expect(result.products.length).toBeGreaterThan(0);
  });

  it('debe aplicar filtro por rango de precios', async () => {
    const query = { minPrice: 50, maxPrice: 100 };
    const result = await service.findAllFiltered(query);
    result.products.forEach(p => {
      expect(p.price).toBeGreaterThanOrEqual(50);
      expect(p.price).toBeLessThanOrEqual(100);
    });
  });

  it('debe combinar múltiples filtros', async () => {
    const query = { gender: 'men', minPrice: 30, sizes: 'M,L' };
    const result = await service.findAllFiltered(query);
    // Verificar que todos los filtros se aplicaron
  });
});
```

---

## Consideraciones Adicionales

### Performance
- Implementar cache con `@nestjs/cache-manager` para queries frecuentes
- Agregar índices compuestos según patrones de uso reales
- Considerar paginación basada en cursor para grandes datasets

### Validación de Negocio
- Validar que `gender` esté en lista permitida (enum)
- Validar que `sizes` contenga valores válidos
- Limitar `limit` máximo (ej: 100 items)

### Seguridad
- Sanitizar parámetros de búsqueda
- Rate limiting en endpoint público
- Validar tipos con `class-validator`

### Respuesta Consistente
```typescript
interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}
```

---

## Resumen de Implementación

1. Crear DTO de validación con class-validator
2. Actualizar controlador para recibir query params
3. Implementar QueryBuilder dinámico en servicio
4. Agregar índices a la base de datos
5. Escribir tests unitarios y e2e
6. (Opcional) Agregar cache para optimización

**Tiempo estimado:** 2-3 horas
**Complejidad:** Media
**Prioridad:** Alta
