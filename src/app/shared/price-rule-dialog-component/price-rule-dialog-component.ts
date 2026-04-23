import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-price-rule-dialog-component',
standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './price-rule-dialog-component.html',
  styleUrl: './price-rule-dialog-component.scss',
})
export class PriceRuleDialogComponent implements OnInit {form: FormGroup;
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<PriceRuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number }
  ) {
    this.form = this.fb.group({
      productId: [data.productId || null, Validators.required],
      ruleName: ['', Validators.required],
      minQuantity: [null, [Validators.required, Validators.min(1)]],
      maxQuantity: [null, [Validators.required, Validators.min(1)]],
      pricePerUnit: [null, [Validators.required, Validators.min(0)]]      
    });

    // Lógica opcional: Autogenerar nombre de regla al cambiar cantidades
    this.form.valueChanges.subscribe(val => {
      if (val.minQuantity && val.maxQuantity && !this.form.get('ruleName')?.dirty) {
        this.form.patchValue({
          ruleName: `Mayoreo ${val.minQuantity}-${val.maxQuantity}`
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(res => this.products = res);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
