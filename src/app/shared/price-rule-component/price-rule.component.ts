import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { PriceRule } from '../../models/PriceRule';
import { PriceRuleService } from '../../services/price-rule-service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PriceRuleDialogComponent } from '../price-rule-dialog-component/price-rule-dialog-component';

interface ProductGroup {
  productId: number;
  productName: string;
  categoryName?: string;
  currentStock: number;
  minStockAlert: number;
  basePrice: number;
  rules: PriceRule[];
}

@Component({
  selector: 'app-price-rules',
  templateUrl: './price-rule.component.html',
  styleUrls: ['./price-rule.component.scss'],
  imports:[CommonModule, MatCardModule, MatIconModule, MatButtonModule]
})
export class PriceRuleComponent implements OnInit {
  @Input() productId!: number; // Recibimos el ID del producto padre
  rules: PriceRule[] = [];
  loading = false;
  groupedRules: ProductGroup[] = [];
  
  constructor(private priceRuleService: PriceRuleService,     
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog, // Inyectamos MatDialog
) {}

  ngOnInit(): void {
    if (this.productId) 
      this.loadRules();
    else 
      this.loadAllRules();
  }

  loadRules() {
    this.priceRuleService.getByProduct(this.productId).subscribe(data => {
      // Ordenamos por cantidad mínima para que la UI se vea lógica
      this.rules = data.sort((a, b) => a.minQuantity - b.minQuantity);
    });
  }

addRule(productId: number = 0): void {
  const dialogRef = this.dialog.open(PriceRuleDialogComponent, {    
    data: { productId: productId } // Pasamos el ID que espera tu JSON
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // El 'result' ya trae el formato JSON que pusiste
      this.priceRuleService.create(result).subscribe({
        next: () => {
          this.loadAllRules(); // Recargamos la lista
        },
        error: (err) => console.error('Error al crear regla', err)
      });
    }
  });
}

  removeRule(id: number) {
    this.priceRuleService.delete(id).subscribe(() => this.loadAllRules());
  }

  getRuleColor(minQty: number): string {
  if (minQty >= 100) return '#7c3aed'; // Violeta para mucho volumen
  if (minQty >= 50) return '#2563eb';  // Azul
  return '#10b981';                    // Verde para escalas bajas
}


calculateDiscountVsBase(base: number, sale: number): string {
  if (!base || base === 0) return '0';
  const diff = ((base - sale) / base) * 100;
  return diff > 0 ? diff.toFixed(1) : '0';
}

loadAllRules() {
    this.loading = true;
    
    this.priceRuleService.getAllPriceRules().subscribe({
      next: (data: any) => {
        // Validamos que data sea un objeto y no sea nulo
        if (data && typeof data === 'object') {
          
          // Usamos Object.entries porque 'data' es un JSON literal, no un Map de JS
          this.groupedRules = Object.entries(data).map(([key, rules]) => {
            const ruleArray = rules as PriceRule[];
            const hasRules = ruleArray && ruleArray.length > 0;
            const product = hasRules ? ruleArray[0].productDTO : null;

            return {
              productId: Number(key),
              productName: product?.name || `Producto #${key}`,
              categoryName: product?.category?.name || 'Sin Categoría',
              currentStock: product?.currentStock ?? 0,
              minStockAlert: product?.minStockAlert ?? 0,
              basePrice: product?.basePrice ?? 0,
              rules: hasRules ? [...ruleArray].sort((a, b) => a.minQuantity - b.minQuantity) : []
            };
          });
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al procesar las reglas de precio:', err);
        this.loading = false;
      }
    });
}

// Tipado estricto para los cálculos
calculateMargin(rule: PriceRule): string {
  if (!rule.pricePerUnit || !rule.salePrice || rule.salePrice === 0) return '0';
  const margin = ((rule.salePrice - rule.pricePerUnit) / rule.salePrice) * 100;
  return margin.toFixed(1);
}

}