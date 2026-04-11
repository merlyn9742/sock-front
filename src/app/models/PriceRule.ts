export interface PriceRule {
  id?: number;
  productId: number;
  minQuantity: number;
  maxQuantity: number;
  pricePerUnit: number;
}