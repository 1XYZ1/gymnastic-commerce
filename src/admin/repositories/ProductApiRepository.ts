/**
 * Implementación del repositorio de productos usando API REST
 *
 * Responsabilidad: Acceso a datos a través de llamadas HTTP
 * Coordina servicios de transformación y subida de archivos
 */

import { gymApi } from '@/api/gymApi';
import type { Product } from '@/interfaces/product.interface';
import type { ProductsResponse } from '@/interfaces/products.response';
import type { ProductAdminFilter, ProductPayload } from '../types';
import type { IProductRepository } from './IProductRepository';
import {
  ImageTransformService,
  FileUploadService,
  ProductFormService,
} from '../services';
import { ProductMapper } from '../mappers';

export class ProductApiRepository implements IProductRepository {
  private readonly baseUrl = import.meta.env.VITE_API_URL;

  /**
   * Obtiene lista de productos con filtros administrativos
   */
  async getProducts(
    filter: ProductAdminFilter = {}
  ): Promise<ProductsResponse> {
    const { data } = await gymApi.get<ProductsResponse>('/products', {
      params: filter,
    });

    // Mapear productos para agregar URLs completas a imágenes
    return {
      ...data,
      products: data.products.map((product) =>
        ProductMapper.toDomain(product, this.baseUrl)
      ),
    };
  }

  /**
   * Obtiene un producto por su ID
   */
  async getProductById(id: string): Promise<Product> {
    if (!id) {
      throw new Error('El ID del producto es requerido');
    }

    // Si es "new", retornar producto vacío
    if (id === 'new') {
      return ProductFormService.createEmptyProduct() as Product;
    }

    const { data } = await gymApi.get<Product>(`/products/${id}`);

    // Mapear para agregar URLs completas a imágenes
    return ProductMapper.toDomain(data, this.baseUrl);
  }

  /**
   * Crea un nuevo producto
   */
  async createProduct(
    product: ProductPayload,
    files?: File[]
  ): Promise<Product> {
    // Preparar imágenes: subir archivos nuevos si existen
    let finalImages = product.images;

    if (files && files.length > 0) {
      const uploadedNames = await FileUploadService.uploadFiles(files);
      finalImages = ImageTransformService.prepareImagesForUpload(
        product.images,
        uploadedNames
      );
    }

    // Mapear para enviar al API (solo nombres de archivo)
    const payload = ProductMapper.toApi({
      ...product,
      images: finalImages,
    });

    const { data } = await gymApi.post<Product>('/products', payload);

    // Mapear respuesta con URLs completas
    return ProductMapper.toDomain(data, this.baseUrl);
  }

  /**
   * Actualiza un producto existente
   */
  async updateProduct(
    id: string,
    product: ProductPayload,
    files?: File[]
  ): Promise<Product> {
    // Preparar imágenes: subir archivos nuevos si existen
    let finalImages = product.images;

    if (files && files.length > 0) {
      const uploadedNames = await FileUploadService.uploadFiles(files);
      finalImages = ImageTransformService.prepareImagesForUpload(
        product.images,
        uploadedNames
      );
    }

    // Mapear para enviar al API (solo nombres de archivo)
    const payload = ProductMapper.toApi({
      ...product,
      images: finalImages,
    });

    const { data } = await gymApi.patch<Product>(`/products/${id}`, payload);

    // Mapear respuesta con URLs completas
    return ProductMapper.toDomain(data, this.baseUrl);
  }
}
