import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { PriceRule } from '../../models/PriceRule';
import { BundleDTO, BundleItemDTO, BundleService } from '../../services/bundle-service';
import { ProductService } from '../../services/product-service';
import { PriceRuleService } from '../../services/price-rule-service';
import { FinancialService } from '../../services/financial-service';

@Component({
  selector: 'app-bundle-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './bundle-form-component.html',
  styleUrl: './bundle-form-component.scss',
})
export class BundleFormComponent implements OnInit {
  bundleForm: FormGroup;
  isEditMode = false;
  products: any[] = [];
  rulesByItem: { [key: number]: PriceRule[] } = {};
  financialReport: any = null;
  isAnalyzing = false;

  constructor(
    private fb: FormBuilder,
    private bundleService: BundleService,
    private productService: ProductService,
    private priceRuleService: PriceRuleService,
    private financialService: FinancialService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.bundleForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      fixedPrice: [{ value: 0, disabled: false }, [Validators.required, Validators.min(0)]],
      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.bundleForm.get('items') as FormArray;
  }

  get fixedPrice(): number {
    return this.bundleForm.get('fixedPrice')?.value || 0;
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      const id = this.route.snapshot.params['id'];
      
      if (id) {
        this.isEditMode = true;
        this.bundleService.getById(id).subscribe(bundle => {
          this.setItems(bundle.items);
          this.bundleForm.patchValue(bundle);
          this.updateTotal();
        });
      } else {
        this.addItem();
      }

      // Escuchar cambios en los items para recalcular el total automáticamente
      this.bundleForm.get('items')?.valueChanges.subscribe(() => {
        this.updateTotal();
      });

      this.cdr.detectChanges();
    });
  }

  updateTotal(): void {
    const total = this.calculateItemsTotal();
    this.bundleForm.get('fixedPrice')?.setValue(total, { emitEvent: false });
    this.cdr.detectChanges();
  }

  calculateItemsTotal(): number {
    return this.items.controls.reduce((total, control) => {
      const qty = control.get('quantity')?.value || 0;
      const price = control.get('assignedUnitPrice')?.value || 0;
      return total + (qty * price);
    }, 0);
  }

  createItem(item?: any): FormGroup {
    const group = this.fb.group({
      id: [item?.id || null],
      productId: [item?.productId || '', Validators.required],
      quantity: [item?.quantity || null, [Validators.required, Validators.min(1)]],
      assignedUnitPrice: [item?.assignedUnitPrice || null, [Validators.required, Validators.min(0)]]
    });

    group.get('productId')?.valueChanges.subscribe(val => {
      const index = this.items.controls.findIndex(x => x === group);
      if (val && index !== -1) {
        this.fetchRules(val, index);
      }
    });

    return group;
  }

  fetchRules(productId: number, index: number): void {
    this.priceRuleService.getByProduct(productId).subscribe({
      next: (rules) => {
        this.rulesByItem[index] = rules;
        this.cdr.detectChanges();
      }
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    delete this.rulesByItem[index];
    this.updateTotal();
  }

  setItems(items: any[]): void {
    const itemFGs = items.map(item => this.createItem(item));
    this.bundleForm.setControl('items', this.fb.array(itemFGs));
  }

  onCancel(): void {
    this.router.navigate(['/bundles/list']);
  }

  onSubmit(): void {
    if (this.bundleForm.valid) {
      const formValue = this.bundleForm.getRawValue(); // getRawValue incluye campos deshabilitados/readonly
      const bundle: BundleDTO = {
        id: formValue.id,
        name: formValue.name,
        fixedPrice: formValue.fixedPrice,
        items: formValue.items.map((item: any) => ({
          assignedUnitPrice: item.assignedUnitPrice,
          quantity: item.quantity,
          product: { id: item.productId }
        }))
      };

      this.bundleService.save(bundle).subscribe(() => this.onCancel());
    }
  }

  showFinancialPreview(): void {
  const formValue = this.bundleForm.getRawValue();
  
  // Mapeamos al formato que espera el backend (BundleItem)
  const bundleItems = formValue.items.map((item: any) => ({
    product: {id: item.productId},
    quantity: item.quantity,
    assignedUnitPrice: item.assignedUnitPrice
  }));

  if (bundleItems.length === 0) return;

  this.isAnalyzing = true;
  this.financialService.calculateBundleFinancial(bundleItems).subscribe({
    next: (report) => {
      this.financialReport = report;
      this.isAnalyzing = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.isAnalyzing = false;
      this.cdr.detectChanges();
    }
  });
}
}