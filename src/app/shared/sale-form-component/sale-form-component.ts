import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// Importa tus servicios y modelos
import { SaleService } from '../../services/sale-service';
import { ProductService } from '../../services/product-service';
import { BundleService } from '../../services/bundle-service';
import { PriceRuleService } from '../../services/price-rule-service';
import { PriceRule } from '../../models/PriceRule';
import { MatButtonModule } from '@angular/material/button';
import { CustomerService } from '../../services/customer-service';

@Component({
  selector: 'app-sale-form-component',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './sale-form-component.html',
  styleUrl: './sale-form-component.scss',
})
export class SaleFormComponent implements OnInit {
  saleForm: FormGroup;
  products: any[] = [];
  availableBundles: any[] = [];
  customers: any[] = [];
  
  // Caché de reglas para evitar llamadas repetidas al API
  rulesByProduct: { [key: number]: PriceRule[] } = {};

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private productService: ProductService,
    private bundleService: BundleService,
    private priceRuleService: PriceRuleService,
    private cdr: ChangeDetectorRef,
    private customerService: CustomerService,
  ) {
    this.saleForm = this.fb.group({
      customerId: [null],
      productsSold: this.fb.array([]),
      bundlesSold: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    // Cargar Catálogos
    this.productService.getAllProducts().subscribe(data => this.products = data);
    this.bundleService.getAll().subscribe(data => this.availableBundles = data);
        
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando clientes', err)
    });

    this.addProduct();
  }

  // Getters para FormArrays
  get productsArray(): FormArray {
    return this.saleForm.get('productsSold') as FormArray;
  }

  get bundlesArray(): FormArray {
    return this.saleForm.get('bundlesSold') as FormArray;
  }

  // --- Lógica de Productos Individuales ---
  addProduct(): void {
    const group = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    // Monitorear cambio de producto para cargar sus reglas
    group.get('productId')?.valueChanges.subscribe(id => {
      if (id) this.fetchRulesForProduct(Number(id));
    });

    this.productsArray.push(group);
  }

  fetchRulesForProduct(productId: number): void {
    if (!this.rulesByProduct[productId]) {
      this.priceRuleService.getByProduct(productId).subscribe({
        next: (rules) => {
          this.rulesByProduct[productId] = rules;
          this.cdr.detectChanges();
        }
      });
    }
  }

  removeProduct(index: number): void {
    this.productsArray.removeAt(index);
  }

  // --- Lógica de Bundles ---
  addBundle(): void {
    this.bundlesArray.push(this.fb.group({
      bundleId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeBundle(index: number): void {
    this.bundlesArray.removeAt(index);
  }

  // --- Cálculos Dinámicos ---
  
  /**
   * Obtiene el precio unitario aplicando reglas de mayoreo si existen
   */
  getUnitPriceForLine(item: any): number {
    const product = this.products.find(x => x.id == item.productId);
    if (!product) return 0;

    const qty = item.quantity || 0;
    const rules = this.rulesByProduct[item.productId] || [];

    // Buscar regla que coincida con la cantidad actual
    const activeRule = rules.find(r => qty >= r.minQuantity && qty <= r.maxQuantity);

    // Retorna el precio de la regla o el base si no hay regla aplicada
    return activeRule ? activeRule.pricePerUnit : product.basePrice;
  }

  get estimatedTotal(): number {
    let total = 0;

    // Sumar Productos Sueltos con lógica de mayoreo
    this.productsArray.controls.forEach(control => {
      const val = control.value;
      if (val.productId) {
        total += (this.getUnitPriceForLine(val) * (val.quantity || 0));
      }
    });

    
    this.bundlesArray.value.forEach((item: any) => {
      const b = this.availableBundles.find(x => x.id == item.bundleId);
      if (b) {
        total += (b.fixedPrice * (item.quantity || 0));
      }
    });

    return total;
  }

  // --- Finalización ---
  onSubmit(): void {
    if (this.saleForm.invalid) return;

    const request = {
      customerId: this.saleForm.value.customerId,
      productsSold: this.saleForm.getRawValue().productsSold,
      bundlesSold: this.saleForm.getRawValue().bundlesSold
    };

    this.saleService.processSale(request).subscribe({
      next: (res) => {
        alert('¡Venta realizada con éxito!');
        this.resetForm();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al procesar la venta';
        alert('Error: ' + msg);
      }
    });
  }

  public resetForm(): void {
    this.saleForm.reset({ customerId: null });
    while (this.productsArray.length) this.productsArray.removeAt(0);
    while (this.bundlesArray.length) this.bundlesArray.removeAt(0);
    this.addProduct();
  }
}