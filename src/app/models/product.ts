import { Category } from "./categoryModels";

export interface Product {
  id?: number;
  name: string;
  gender: 'Hombre' | 'Mujer' | 'Niño' | 'Niña' | 'Unisex',
  currentStock: number;
  minStockAlert: number;
  basePrice: number;
category: Category;
}