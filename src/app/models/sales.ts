export interface ProductSold {
  productId: number;
  quantity: number;
}

export interface BundleSold {
  bundleId: number;
  quantity: number;
}

export interface SaleRequest {
  customerId: number | null;
  productsSold: ProductSold[];
  bundlesSold: BundleSold[];
}

export interface SaleResponse {
  id: number;
  saleDate: string;
  subtotal: number;
  taxIva: number;
  grandTotal: number;
  // Añade otros campos según tu entidad Sale
}

export interface SaleDTO {
  id: number;
  customerName: string;
  saleDate: Date;
  subtotal: number;
  taxIva: number;
  taxIsr: number;
  netProfit: number;
  grandTotal: number;
  items: SaleItemDto[]; // SaleItemDto
}

export interface SaleItemDto {
  id: number;
  product?: { name: string };
  bundle?: { name: string };
  quantity: number;
  unitPriceAtSale: number;
  unitCostAtSale: number;
  purchaseItem?: any; 
}