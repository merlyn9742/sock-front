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