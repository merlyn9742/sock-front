import { Product } from "./product";

export interface PriceRule {
  id?: number;
  productId: number;
  productDTO: Product; // Debe llamarse igual que en Java: productDTO
  pricePerUnit: number;
  ruleName: string;
  salePrice: number;
  minQuantity: number;
  maxQuantity: number;
}