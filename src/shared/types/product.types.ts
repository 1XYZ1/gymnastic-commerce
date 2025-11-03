import type { User } from './user.types';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  type: ProductType;
  species?: ProductSpecies | null;
  tags: string[];
  images: string[];
  user: User;
}

export type Size = '500g' | '1kg' | '3kg' | '7kg' | '15kg' | '20kg' | 'S' | 'M' | 'L' | 'XL';

export type ProductType =
  | 'alimento-seco'
  | 'alimento-humedo'
  | 'snacks'
  | 'accesorios'
  | 'juguetes'
  | 'higiene';

export type ProductSpecies = 'cats' | 'dogs';

// Mantener Category por compatibilidad (deprecated)
export type Category = ProductSpecies;
