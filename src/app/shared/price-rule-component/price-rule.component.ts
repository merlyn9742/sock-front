import { Component, Input, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { PriceRule } from '../../models/PriceRule';
import { PriceRuleService } from '../../services/price-rule-service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-price-rules',
  templateUrl: './price-rule.component.html',
  styleUrls: ['./price-rule.component.scss'],
  imports:[CommonModule, MatCardModule, MatIconModule, MatButtonModule]
})
export class PriceRuleComponent implements OnInit {
  @Input() productId!: number; // Recibimos el ID del producto padre
  rules: PriceRule[] = [];

  constructor(private service: PriceRuleService) {}

  ngOnInit(): void {
    if (this.productId) this.loadRules();
  }

  loadRules() {
    this.service.getByProduct(this.productId).subscribe(data => {
      // Ordenamos por cantidad mínima para que la UI se vea lógica
      this.rules = data.sort((a, b) => a.minQuantity - b.minQuantity);
    });
  }

  async addRule() {
    const { value: formValues } = await Swal.fire({
      title: 'Nueva Regla de Mayoreo',
      html:
        `<input id="swal-min" class="swal2-input" placeholder="Min Cantidad" type="number">` +
        `<input id="swal-max" class="swal2-input" placeholder="Max Cantidad" type="number">` +
        `<input id="swal-price" class="swal2-input" placeholder="Precio unitario" type="number">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          productId: this.productId,
          minQuantity: (document.getElementById('swal-min') as HTMLInputElement).value,
          maxQuantity: (document.getElementById('swal-max') as HTMLInputElement).value,
          pricePerUnit: (document.getElementById('swal-price') as HTMLInputElement).value
        }
      }
    });

    if (formValues) {
      this.service.create(formValues).subscribe(() => this.loadRules());
    }
  }

  removeRule(id: number) {
    this.service.delete(id).subscribe(() => this.loadRules());
  }
}