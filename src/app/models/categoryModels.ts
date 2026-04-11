export interface Category {
  id?: number;
  name: string;
  tenantId?: string; // El backend lo asigna, pero es bueno tenerlo
}