import { Product } from "./product";

export interface PurchaseItemRequest {
  productId: number;
  isBulk: boolean;
  unitsPerBulk: number;
  unitCostNet: number;
  profitMarginPercent: number;
  isrPercentConfig: number;
  isTaxed: boolean;
  suggestedSalePrice: number;
  pricePerBulk: number;
  bulksReceived: number;
  individualUnitsReceived: number;
  totalUnitsInventory: number;
  subtotal: number;
}

export interface PurchaseRequest {
  supplierName: string;
  totalInvoiceAmount: number;
  purchaseItemRequest: PurchaseItemRequest[];
}

export interface Purchase {
  id?: number;
  supplierName: string;
  totalInvoiceAmount: number;
  purchaseDate?: string;
  createdAt?: string; 
  updatedAt?: string;
  purchaseItemsRequest: PurchaseItem[];
}
export interface PurchaseItem {
  isBulk: boolean;
  unitsPerBulk: number;
  bulksReceived: number;
  individualUnitsReceived: number;
  totalUnitsAcquired: number;
  unitCostNet: number;
  isTaxed: boolean;
  pricePerBulk?: number;
  totalPaid: number;
  productId: number;
  product?: Product; // El DTO del backend lo envía para visualización
  stockRemaining: number;
}