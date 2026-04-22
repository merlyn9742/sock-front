import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SaleDTO } from '../../models/sales';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { SaleService } from '../../services/sale-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-sale-list',
  imports: [CommonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatTableModule],
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.scss',
})
export class SaleList implements OnInit {sales: SaleDTO[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  
  displayedColumns: string[] = ['id', 'date', 'customer', 'items', 'financials', 'profit', 'actions'];

  constructor(private saleService: SaleService, private snackBar: MatSnackBar, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
setTimeout(() => {
    this.loadSales();
  }, 0);
  }

loadSales(): void {
  this.saleService.getSales(this.currentPage, this.pageSize).subscribe({
    next: (res) => {
      this.sales = res.content;
      this.totalElements = res.totalElements;
      this.cd.detectChanges(); // 3. Forzar detección de cambios
    },
    error: () => this.showMsg('Error al cargar ventas')
  });
}

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSales();
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: '¿Anular venta?',
      text: 'El stock regresará a los bultos originales.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular',
      cancelButtonColor: '#64748b',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.deleteSale(id).subscribe(() => {
          this.showMsg('Venta anulada con éxito');
          this.loadSales();
        });
      }
    });
  }

  private showMsg(m: string) {
    this.snackBar.open(m, 'Cerrar', { duration: 3000 });
  }
}