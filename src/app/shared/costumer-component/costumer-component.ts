import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Customer } from '../../models/Costumer';
import { CostumerService } from '../../services/costumer-service';
import { AddCustomerModal } from '../costumerComponent/add-customer-modal/add-customer-modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-costumer-component',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatCardModule, MatDialogModule], 
   templateUrl: './costumer-component.html',
  styleUrl: './costumer-component.scss',
})
export class CostumerComponent implements OnInit {

  dataSource = new MatTableDataSource<Customer>([]);
  displayedColumns: string[] = ['name', 'phone', 'actions'];  

  constructor(private customerService: CostumerService,
    private dialog: MatDialog // Inyectamos MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  openCustomerModal(customer?: Customer): void {
    const dialogRef = this.dialog.open(AddCustomerModal, {
      width: '450px',
      disableClose: true,
      data: { customer: customer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (customer && customer.id) {
          // Lógica de Edición
          this.customerService.update(customer.id, { ...result }).subscribe(() => {
            this.loadCustomers();
            Swal.fire('Actualizado', 'Cliente actualizado con éxito', 'success');
          });
        } else {
          // Lógica de Creación
          const newCustomer: Customer = { ...result };
          this.customerService.create(newCustomer).subscribe(() => {
            this.loadCustomers();
            Swal.fire('¡Éxito!', 'Cliente registrado', 'success');
          });
        }
      }
    });
  }

  loadCustomers() {
    this.customerService.getAll("test").subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // MÉTODO CLAVE: Abrir WhatsApp con un mensaje predeterminado
  contactWhatsApp(customer: Customer) {
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/\D/g, ''); // Limpiar símbolos
    const message = encodeURIComponent(`¡Hola ${customer.name}! Te contacto de Socks Control...`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  }

deleteCustomer(id: number) {
    Swal.fire({
      title: '¿Eliminar cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.customerService.delete(id).subscribe(() => {
          this.loadCustomers();
          Swal.fire('Eliminado', '', 'success');
        });
      }
    });
  }

}
