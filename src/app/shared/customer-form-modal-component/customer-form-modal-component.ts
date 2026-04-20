import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer-service';
import { Customer } from '../../models/Costumer';

@Component({
  selector: 'app-customer-form-modal-component',    
imports: [CommonModule, ReactiveFormsModule, MatDialogModule],  
templateUrl: './customer-form-modal-component.html',
  styleUrl: './customer-form-modal-component.scss',
})
export class CustomerFormModalComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<CustomerFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer | null
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      phone: [data?.phone || '']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const obs = this.data 
      ? this.customerService.update(this.data.id!, this.form.value)
      : this.customerService.create(this.form.value);

    obs.subscribe(() => this.dialogRef.close(true));
  }

  close(): void { this.dialogRef.close(); }
}
