import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Purchase } from '../../models/purchase';
import { PurchaseService } from '../../services/purchase-service';
import { PurchaseFormModalComponent } from '../purchase-form-modal-component/purchase-form-modal-component';
import { catchError, map, Observable, of } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-purchase-list-component',
imports: [CommonModule, MatIconModule, MatDialogModule, MatPaginatorModule],
  templateUrl: './purchase-list-component.html',
  styleUrl: './purchase-list-component.scss',
})
export class PurchaseListComponent implements OnInit {

  purchases: Purchase[] = [];
  purchases$!: Observable<Purchase[]>;
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  constructor(private purchaseService: PurchaseService, private dialog: MatDialog, 

    private cdr: ChangeDetectorRef // 2. Inyecta

  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

loadPurchases(): void {
  this.purchases$ = this.purchaseService.getAll(this.currentPage, this.pageSize).pipe(
    map(response => {
      // IMPORTANTE: Spring envía 'totalElements' y 'content'
      this.totalElements = response.totalElements; 
      this.purchases = response.content; 
      return response.content;
    }),
    catchError(err => {
      console.error('Error al cargar compras:', err);
      this.totalElements = 0;
      this.purchases = [];
      return of([]);
    })
  );
}

  openPurchaseModal(): void {
    const dialogRef = this.dialog.open(PurchaseFormModalComponent, {
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPurchases();
    });
  }

 
deletePurchase(id: number): void {
  // 1. Confirmación de seguridad
  const confirmed = confirm(
    '¿Estás seguro de eliminar este registro de compra?\n\n' +
    'Nota: Esta acción borrará el historial, pero no revertirá automáticamente ' +
    'el stock físico ni las reglas de precio generadas.'
  );

  if (confirmed) {
    this.purchaseService.delete(id).subscribe({
      next: () => {
        // 2. Notificación de éxito (puedes usar un SnackBar de Material si prefieres)
        console.log('Compra eliminada correctamente');
        
        // 3. Refrescar la lista para actualizar la UI y las estadísticas
        this.loadPurchases();
      },
      error: (err) => {
        // 4. Manejo de errores
        const errorMsg = err.error?.message || 'No se pudo eliminar el registro';
        alert('Error: ' + errorMsg);
        console.error('Error al borrar compra:', err);
      }
    });
  }
}

calculateTotalInvestment(purchases: Purchase[]): number {
  return (purchases || []).reduce((acc, p) => acc + (p.totalInvoiceAmount || 0), 0);
}

onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPurchases();
  }
}
