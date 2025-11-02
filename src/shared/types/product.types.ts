import type { User } from './user.types';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  category: Category;
  tags: string[];
  images: string[];
  user: User;
}

export type Size = '500g' | '1kg' | '3kg' | '7kg' | '15kg' | '20kg' | 'S' | 'M' | 'L' | 'XL';

export type Category = 'cats' | 'dogs';
