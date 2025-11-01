# Documentación API - Filtros de Productos

## Endpoint

```
GET /api/products
```

Base URL: `http://localhost:3000`

---

## Parámetros de Query (Todos Opcionales)

### Paginación

| Parámetro | Tipo | Descripción | Validación | Default | Ejemplo |
|-----------|------|-------------|------------|---------|---------|
| `limit` | number | Cantidad de productos por página | Min: 1, Max: 100 | 10 | `?limit=20` |
| `offset` | number | Número de productos a saltar | Min: 0 | 0 | `?offset=10` |

### Filtros

| Parámetro | Tipo | Descripción | Validación | Ejemplo |
|-----------|------|-------------|------------|---------|
| `q` | string | Búsqueda de texto en título y descripción (case-insensitive) | - | `?q=collar` |
| `gender` | string | Filtro por género | Valores: `men`, `women`, `kid`, `unisex` | `?gender=women` |
| `sizes` | string | Filtro por tallas (separadas por coma) | - | `?sizes=S,M,L` |
| `minPrice` | number | Precio mínimo (inclusivo) | Min: 0 | `?minPrice=20.5` |
| `maxPrice` | number | Precio máximo (inclusivo) | Min: 0 | `?maxPrice=99.99` |

---

## Reglas de Negocio

### 1. Búsqueda de Texto (`q`)
- Busca en **título** y **descripción** del producto
- Es **case-insensitive** (no diferencia mayúsculas/minúsculas)
- Usa coincidencia parcial (`"collar"` encuentra `"Pet Collar Premium"`)
- Espacios y caracteres especiales son permitidos

### 2. Filtro de Género (`gender`)
- Cuando filtras por un género específico, **siempre incluye productos `unisex`**
  - Ejemplo: `?gender=men` retorna productos `men` + `unisex`
  - Ejemplo: `?gender=women` retorna productos `women` + `unisex`
- Si NO especificas `gender`, retorna todos los productos (todos los géneros)

### 3. Filtro de Tallas (`sizes`)
- Acepta **una o más tallas** separadas por coma
- Retorna productos que tengan **al menos UNA** de las tallas especificadas (OR lógico)
- Los espacios son ignorados: `"S, M, L"` y `"S,M,L"` son equivalentes
- Tallas comunes: `XS`, `S`, `M`, `L`, `XL`, `XXL`, `XXXL`

### 4. Rango de Precios (`minPrice`, `maxPrice`)
- Puedes usar solo `minPrice`, solo `maxPrice`, o ambos
- Los valores son **inclusivos**:
  - `?minPrice=20&maxPrice=50` incluye productos que cuestan exactamente $20 o $50
- Si `minPrice > maxPrice`, retornará 0 resultados (es válido pero vacío)

### 5. Paginación
- El `limit` máximo es **100** para evitar sobrecarga del servidor
- El `offset` permite implementar paginación:
  - Página 1: `?offset=0&limit=10`
  - Página 2: `?offset=10&limit=10`
  - Página 3: `?offset=20&limit=10`

### 6. Combinación de Filtros
- **Todos los filtros son opcionales y combinables**
- Cuando se usan múltiples filtros, se aplican con lógica **AND**:
  - `?gender=men&minPrice=20&sizes=M,L` retorna solo productos que cumplan **todos** los criterios

---

## Estructura de Respuesta

### Respuesta Exitosa (200 OK)

```json
{
  "products": [
    {
      "id": "uuid-string",
      "title": "Pet Collar Premium",
      "price": 29.99,
      "description": "Collar de alta calidad para mascotas",
      "slug": "pet_collar_premium",
      "stock": 15,
      "sizes": ["S", "M", "L"],
      "gender": "unisex",
      "tags": ["collar", "accessories"],
      "images": [
        "http://localhost:3000/api/files/product/image1.jpg",
        "http://localhost:3000/api/files/product/image2.jpg"
      ],
      "user": {
        "id": "uuid",
        "email": "user@example.com"
      }
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0,
  "pages": 5
}
```

### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `products` | Array | Lista de productos que cumplen los filtros |
| `total` | number | Cantidad total de productos que cumplen los filtros (sin paginación) |
| `limit` | number | Límite usado en la consulta |
| `offset` | number | Offset usado en la consulta |
| `pages` | number | Cantidad total de páginas (`Math.ceil(total / limit)`) |

---

## Códigos de Error

### 400 Bad Request

**Se retorna cuando hay errores de validación en los parámetros:**

```json
{
  "statusCode": 400,
  "message": [
    "limit must not be less than 1",
    "gender must be one of the following values: men, women, kid, unisex"
  ],
  "error": "Bad Request"
}
```

**Casos comunes:**
- `limit` menor a 1 o mayor a 100
- `offset` negativo
- `gender` con valor inválido (no es `men`, `women`, `kid`, o `unisex`)
- `minPrice` o `maxPrice` negativos
- Parámetros con tipo de dato incorrecto (ej: `limit=abc`)

---

## Ejemplos de Uso

### 1. Obtener todos los productos (paginación por defecto)

```
GET /api/products
```

Retorna los primeros 10 productos.

---

### 2. Búsqueda de texto

```
GET /api/products?q=collar
```

Busca "collar" en título y descripción de productos.

---

### 3. Filtrar por género

```
GET /api/products?gender=women
```

Retorna productos para mujeres + unisex.

---

### 4. Filtrar por tallas

```
GET /api/products?sizes=M,L,XL
```

Retorna productos que tengan talla M, L, o XL.

---

### 5. Filtrar por rango de precios

```
GET /api/products?minPrice=20&maxPrice=100
```

Retorna productos entre $20 y $100 (inclusivo).

---

### 6. Búsqueda combinada completa

```
GET /api/products?q=shirt&gender=men&sizes=M,L&minPrice=25&maxPrice=75&limit=20&offset=0
```

Busca camisas para hombres, tallas M o L, precio entre $25-$75, primera página de 20 resultados.

---

### 7. Paginación

**Página 1 (primeros 15 productos):**
```
GET /api/products?limit=15&offset=0
```

**Página 2 (siguientes 15 productos):**
```
GET /api/products?limit=15&offset=15
```

**Página 3:**
```
GET /api/products?limit=15&offset=30
```

---

## Notas para el Frontend

### Cálculo de Paginación

```javascript
// Calcular offset para una página específica
const pageNumber = 3; // Página que quieres mostrar (1-indexed)
const pageSize = 10;  // Productos por página
const offset = (pageNumber - 1) * pageSize;

// Ejemplo: Página 3 con 10 items por página
// offset = (3 - 1) * 10 = 20
```

### Construcción de Query String

```javascript
const buildQueryString = (filters) => {
  const params = new URLSearchParams();

  if (filters.q) params.append('q', filters.q);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','));
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.offset !== undefined) params.append('offset', filters.offset);

  return params.toString();
};

// Uso
const filters = {
  q: 'collar',
  gender: 'men',
  sizes: ['M', 'L'],
  minPrice: 20,
  maxPrice: 100,
  limit: 20,
  offset: 0
};

const queryString = buildQueryString(filters);
// Resultado: "q=collar&gender=men&sizes=M,L&minPrice=20&maxPrice=100&limit=20&offset=0"

fetch(`/api/products?${queryString}`);
```

### Manejo de Respuesta Vacía

```javascript
const response = await fetch('/api/products?q=busqueda-sin-resultados');
const data = await response.json();

if (data.total === 0) {
  console.log('No se encontraron productos');
  // Mostrar mensaje "Sin resultados"
}
```

### Validación de Inputs antes de Enviar

```javascript
const validateFilters = (filters) => {
  const errors = [];

  // Validar limit
  if (filters.limit && (filters.limit < 1 || filters.limit > 100)) {
    errors.push('Limit debe estar entre 1 y 100');
  }

  // Validar offset
  if (filters.offset && filters.offset < 0) {
    errors.push('Offset no puede ser negativo');
  }

  // Validar gender
  const validGenders = ['men', 'women', 'kid', 'unisex'];
  if (filters.gender && !validGenders.includes(filters.gender)) {
    errors.push('Género inválido');
  }

  // Validar precios
  if (filters.minPrice && filters.minPrice < 0) {
    errors.push('Precio mínimo no puede ser negativo');
  }

  if (filters.maxPrice && filters.maxPrice < 0) {
    errors.push('Precio máximo no puede ser negativo');
  }

  return errors;
};
```

---

## Información Adicional

- **Base URL de desarrollo:** `http://localhost:3000`
- **Documentación Swagger:** `http://localhost:3000/api` (interfaz interactiva)
- **Codificación:** Todos los strings deben ser URL-encoded
  - Ejemplo: `?q=collar premium` → `?q=collar%20premium`
- **Timeout recomendado:** 10 segundos para peticiones GET

---

## Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2025-11-01 | Release inicial con filtros avanzados |
