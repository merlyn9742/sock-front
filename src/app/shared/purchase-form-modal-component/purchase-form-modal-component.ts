import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../../services/purchase-service';
import { ProductService } from '../../services/product-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-purchase-form-modal-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule],
  templateUrl: './purchase-form-modal-component.html',
  styleUrl: './purchase-form-modal-component.scss',
})
export class PurchaseFormModalComponent implements OnInit {
  purchaseForm: FormGroup;
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<PurchaseFormModalComponent>
  ) {
    this.purchaseForm = this.fb.group({
      supplierName: ['', Validators.required],
      totalInvoiceAmount: [0, [Validators.required, Validators.min(0.01)]],
      purchaseItemsRequest: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.productService.getAll().subscribe(data => this.products = data);
    this.addItem(); // Iniciar con una fila
  }

  get itemsArray(): FormArray {
    return this.purchaseForm.get('purchaseItemsRequest') as FormArray;
  }

addItem(): void {
  const itemGroup = this.fb.group({
    productId: ['', Validators.required],
    isBulk: [false],
    unitsPerBulk: [1, [Validators.required, Validators.min(1)]],
    bulksReceived: [0, Validators.min(0)],
    individualUnitsReceived: [0, Validators.min(0)],
    totalUnitsAcquired: [{ value: 0, disabled: true }],
    unitCostNet: [0, [Validators.required, Validators.min(0.1)]],            
    isTaxed: [false],
    pricePerBulk: [0], // Quitamos required inicial para que no bloquee si no es bulk
    totalPaid: [0, Validators.required],
  });

  // Escuchamos cambios en la fila
  itemGroup.valueChanges.subscribe(val => {
    const isBulk = val.isBulk;
    const unitCostControl = itemGroup.get('unitCostNet');
    const totalPaidControl = itemGroup.get('totalPaid');
    const individualUnitsControl = itemGroup.get('individualUnitsReceived');

    // 1. Lógica de Bloqueo y Cálculos según isBulk
    if (isBulk) {
      // Bloquear unidades sueltas y resetearlas
      if (individualUnitsControl?.enabled) {
        individualUnitsControl.disable({ emitEvent: false });
        individualUnitsControl.setValue(0, { emitEvent: false });
      }

      // Bloquear Costo Unitario y calcularlo automáticamente
      if (unitCostControl?.enabled) unitCostControl.disable({ emitEvent: false });
      
      const pricePerBulk = val.pricePerBulk || 0;
      const unitsPerBulk = val.unitsPerBulk || 1;
      const calculatedUnitCost = pricePerBulk / unitsPerBulk;
      
      unitCostControl?.setValue(calculatedUnitCost, { emitEvent: false });

      if (!!val.bulksReceived) {
        const totalPaid = pricePerBulk * val.bulksReceived;
        totalPaidControl?.setValue(totalPaid, { emitEvent: false });
      }      

    } else {
      // Habilitar campos si no es bulto
      if (individualUnitsControl?.disabled) individualUnitsControl.enable({ emitEvent: false });
      if (unitCostControl?.disabled) unitCostControl.enable({ emitEvent: false });
      
      // Limpiar campos de bulto para evitar basura en el cálculo
      itemGroup.get('bulksReceived')?.setValue(0, { emitEvent: false });
    }

    // 2. Cálculo de Inventario Total
    // Usamos val.xxx || 0 por si los campos están deshabilitados (null en el stream de cambios)
    const currentBulks = itemGroup.get('bulksReceived')?.value || 0;
    const currentUnitsPerBulk = itemGroup.get('unitsPerBulk')?.value || 0;
    const currentIndividual = itemGroup.get('individualUnitsReceived')?.value || 0;
    
    const total = (currentBulks * currentUnitsPerBulk) + currentIndividual;
    itemGroup.get('totalUnitsAcquired')?.setValue(total, { emitEvent: false });
  });

  this.itemsArray.push(itemGroup);
}

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  save(): void {
    if (this.purchaseForm.invalid) return;
    
    const rawValue = this.purchaseForm.getRawValue();
    this.purchaseService.save(rawValue).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => alert("Error: " + (err.error?.message || "No se pudo registrar la compra"))
    });
  }

  close(): void { this.dialogRef.close(); }
}