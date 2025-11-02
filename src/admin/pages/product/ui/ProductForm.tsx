/**
 * Formulario de producto refactorizado
 *
 * ANTES: 549 líneas con lógica mezclada
 * AHORA: ~270 líneas - Solo UI y coordinación
 *
 * Responsabilidad: Presentación y coordinación del formulario
 * La lógica de negocio está en services, la lógica de estado en hooks
 */

import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';

import { AdminTitle } from '@/admin/components/AdminTitle';
import { Button } from '@/components/ui/button';
import type { Product } from '@/shared/types';
import { X, SaveAll, Tag, Plus, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hooks y configuración del módulo admin
import { useFileUpload } from '@/admin/hooks/useFileUpload';
import { useTagManager } from '@/admin/hooks/useTagManager';
import { useSizeManager } from '@/admin/hooks/useSizeManager';
import { AVAILABLE_SIZES, CATEGORY_OPTIONS } from '@/admin/config';

interface Props {
  title: string;
  subTitle: string;
  product: Product;
  isPending: boolean;
  onSubmit: (
    productLike: Partial<Product> & { files?: File[] }
  ) => Promise<void>;
}

interface FormInputs extends Product {
  files?: File[];
}

export const ProductForm = ({
  title,
  subTitle,
  product,
  onSubmit,
  isPending,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: product,
  });

  const labelInputRef = useRef<HTMLInputElement>(null);

  // Callback estable para evitar loops infinitos
  const handleFilesChange = useCallback(
    (newFiles: File[]) => {
      setValue('files', newFiles);
    },
    [setValue]
  );

  // Hook personalizado para manejo de archivos
  const { files, dragActive, handleDrag, handleDrop, handleFileChange, clearFiles } =
    useFileUpload(handleFilesChange);

  // Resetear archivos cuando cambie el producto
  useEffect(() => {
    clearFiles();
  }, [product, clearFiles]);

  // Watch de valores del formulario
  const selectedSizes = watch('sizes');
  const selectedTags = watch('tags');
  const currentStock = watch('stock');

  // Hook personalizado para manejo de tags
  const { addTag: addTagToList, removeTag: removeTagFromList } = useTagManager(
    selectedTags,
    (newTags) => setValue('tags', newTags)
  );

  // Hook personalizado para manejo de tallas
  const { addSize: addSizeToList, removeSize: removeSizeFromList, hasSize } =
    useSizeManager(selectedSizes, (newSizes) => setValue('sizes', newSizes));

  // Handler para agregar tag desde el input
  const handleAddTag = () => {
    const newTag = labelInputRef.current!.value;
    if (newTag === '') return;

    addTagToList(newTag);
    labelInputRef.current!.value = '';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center">
        <AdminTitle title={title} subtitle={subTitle} />
        <div className="flex justify-end mb-10 gap-4">
          <Link to="/admin/products">
            <Button variant="outline" type="button">
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </Link>

          <Button type="submit" disabled={isPending}>
            <SaveAll className="w-4 h-4" />
            Guardar cambios
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Información del producto
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="product-title" className="block text-sm font-medium text-slate-700 mb-2">
                    Título del producto
                  </label>
                  <input
                    id="product-title"
                    type="text"
                    {...register('title', { required: true })}
                    className={cn(
                      'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                      { 'border-red-500': errors.title }
                    )}
                    placeholder="Título del producto"
                    aria-invalid={errors.title ? 'true' : 'false'}
                    aria-describedby={errors.title ? 'product-title-error' : undefined}
                  />
                  {errors.title && (
                    <p id="product-title-error" className="text-red-500 text-sm" role="alert">
                      El título es requerido
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-price" className="block text-sm font-medium text-slate-700 mb-2">
                      Precio (CLP$)
                    </label>
                    <input
                      id="product-price"
                      type="number"
                      {...register('price', { required: true, min: 1 })}
                      className={cn(
                        'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                        { 'border-red-500': errors.price }
                      )}
                      placeholder="Precio del producto"
                      aria-invalid={errors.price ? 'true' : 'false'}
                      aria-describedby={errors.price ? 'product-price-error' : undefined}
                    />
                    {errors.price && (
                      <p id="product-price-error" className="text-red-500 text-sm" role="alert">
                        El precio debe de ser mayor a 0
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="product-stock" className="block text-sm font-medium text-slate-700 mb-2">
                      Stock del producto
                    </label>
                    <input
                      id="product-stock"
                      type="number"
                      {...register('stock', { required: true, min: 1 })}
                      className={cn(
                        'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                        { 'border-red-500': errors.stock }
                      )}
                      placeholder="Stock del producto"
                      aria-invalid={errors.stock ? 'true' : 'false'}
                      aria-describedby={errors.stock ? 'product-stock-error' : undefined}
                    />
                    {errors.stock && (
                      <p id="product-stock-error" className="text-red-500 text-sm" role="alert">
                        El inventario debe de ser mayor a 0
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="product-slug" className="block text-sm font-medium text-slate-700 mb-2">
                    Slug del producto
                  </label>
                  <input
                    id="product-slug"
                    type="text"
                    {...register('slug', {
                      required: true,
                      validate: (value) =>
                        !/\s/.test(value) ||
                        'El slug no puede contener espacios en blanco',
                    })}
                    className={cn(
                      'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                      { 'border-red-500': errors.slug }
                    )}
                    placeholder="Slug del producto"
                    aria-invalid={errors.slug ? 'true' : 'false'}
                    aria-describedby={errors.slug ? 'product-slug-error' : undefined}
                  />
                  {errors.slug && (
                    <p id="product-slug-error" className="text-red-500 text-sm" role="alert">
                      {errors.slug.message || 'El slug es requerido.'}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="product-category" className="block text-sm font-medium text-slate-700 mb-2">
                    Categoría del producto
                  </label>
                  <select
                    id="product-category"
                    {...register('category')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="product-description" className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción del producto
                  </label>
                  <textarea
                    id="product-description"
                    {...register('description', { required: true })}
                    rows={5}
                    className={cn(
                      'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                      { 'border-red-500': errors.description }
                    )}
                    placeholder="Descripción del producto"
                    aria-invalid={errors.description ? 'true' : 'false'}
                    aria-describedby={errors.description ? 'product-description-error' : undefined}
                  />
                  {errors.description && (
                    <p id="product-description-error" className="text-red-500 text-sm" role="alert">
                      La descripción es requerida.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Tallas disponibles
              </h2>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((size) => (
                    <span
                      key={size}
                      className={cn(
                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200',
                        { hidden: !selectedSizes.includes(size) }
                      )}
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSizeFromList(size)}
                        className="cursor-pointer ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  <span className="text-sm text-slate-600 mr-2">
                    Añadir tallas:
                  </span>
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => addSizeToList(size)}
                      disabled={hasSize(size)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        hasSize(size)
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Etiquetas
              </h2>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTagFromList(tag)}
                        className="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <label htmlFor="product-tag-input" className="sr-only">
                    Añadir nueva etiqueta
                  </label>
                  <input
                    id="product-tag-input"
                    ref={labelInputRef}
                    type="text"
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' ||
                        e.key === ' ' ||
                        e.key === ','
                      ) {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Añadir nueva etiqueta..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    aria-label="Añadir nueva etiqueta al producto"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-lg"
                    aria-label="Agregar etiqueta"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Imágenes del producto
              </h2>

              {/* Drag & Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div>
                    <p className="text-lg font-medium text-slate-700">
                      Arrastra las imágenes aquí
                    </p>
                    <p className="text-sm text-slate-500">
                      o haz clic para buscar
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, WebP hasta 10MB cada una
                  </p>
                </div>
              </div>

              {/* Current Images */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-slate-700">
                  Imágenes actuales
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                        <img
                          src={image}
                          alt="Product"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="mt-1 text-xs text-slate-600 truncate">
                        {image}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Imágenes por cargar */}
              <div
                className={cn('mt-6 space-y-3', {
                  hidden: files.length === 0,
                })}
              >
                <h3 className="text-sm font-medium text-slate-700">
                  Imágenes por cargar
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {files.map((file, index) => (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Product"
                      key={index}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Estado del producto
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Estado
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Activo
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Inventario
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      currentStock > 5
                        ? 'bg-green-100 text-green-800'
                        : currentStock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {currentStock > 5
                      ? 'En stock'
                      : currentStock > 0
                      ? 'Bajo stock'
                      : 'Sin stock'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Imágenes
                  </span>
                  <span className="text-sm text-slate-600">
                    {product.images.length} imágenes
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">
                    Tallas disponibles
                  </span>
                  <span className="text-sm text-slate-600">
                    {selectedSizes.length} tallas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
