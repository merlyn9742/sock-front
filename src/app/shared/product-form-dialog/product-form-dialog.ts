import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../models/categoryModels';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './product-form-dialog.html',
  styleUrls: ['product-form-dialog.scss']
})
export class ProductFormDialog implements OnInit {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[], product?: any }
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: [null, Validators.required],
      gender: ['HOMBRE', Validators.required],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      minStockAlert: [12, [Validators.required, Validators.min(0)]],
      basePrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data.product) {
      this.productForm.patchValue({
        ...this.data.product,
        categoryId: this.data.product.category?.id
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

save(): void {
  if (this.productForm.valid) {
    const val = this.productForm.value;
    
    // Construimos exactamente el JSON que enviamos antes
    const payload = [{
      id: this.data.product?.id || null, // Importante para editar
      name: val.name,
      gender: val.gender, // Ahora enviamos "HOMBRE", "MUJER", etc.
      currentStock: val.currentStock,
      minStockAlert: val.minStockAlert,
      basePrice: val.basePrice,
      category: { id: val.categoryId } // Estructura anidada
    }];
    
    this.dialogRef.close(payload);
  }
}
}