import { Component } from '@angular/core';
import { Customer } from '../../models/Costumer';
import { CustomerService } from '../../services/customer-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CustomerFormModalComponent } from '../customer-form-modal-component/customer-form-modal-component';

@Component({
  selector: 'app-customer-list-component',
  imports: [MatDialogModule, CommonModule, MatIconModule],
  templateUrl: './customer-list-component.html',
  styleUrl: './customer-list-component.scss',
})
export class CustomerListComponent {
  customers: Customer[] = [];

  constructor(private customerService: CustomerService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe(data => this.customers = data);
  }

  openForm(customer?: Customer): void {
    const dialogRef = this.dialog.open(CustomerFormModalComponent, {
      width: '400px',
      data: customer || null,
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCustomers();
    });
  }

  deleteCustomer(id: number): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.customerService.delete(id).subscribe(() => this.loadCustomers());
    }
  }
}
