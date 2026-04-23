import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Product } from '../../models/product';
import { Category } from '../../models/categoryModels';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category';
import Swal from 'sweetalert2';
import { ProductFormDialog } from '../product-form-dialog/product-form-dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatButtonModule, 
    MatMenuModule, MatTableModule, MatCardModule, MatDialogModule, MatProgressBarModule, MatDividerModule,
    MatPaginatorModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  
  dataSource = new MatTableDataSource<Product>([]);
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = true;
  displayedColumns: string[] = ['product', 'gender', 'stock', 'price', 'actions'];
totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadData();
    }, 0);
  }

loadData(): void {
    this.isLoading = true;
    this.cd.detectChanges(); // 4. Forzar detección antes de la petición
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    
    // Llamada con paginación
    this.productService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        // En Spring, los datos vienen en .content
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
        this.cd.detectChanges(); // 4. Forzar detección antes de la petición
      },
      error: () => {
        this.isLoading = false
        this.cd.detectChanges();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  openProductModal(productToEdit?: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialog, {
      width: '550px',
      disableClose: true,
      data: { 
        categories: this.categories,
        product: productToEdit 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 'result' es el array [Product] devuelto por el Dialog
        this.saveProduct(result);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculateStockPercent(p: Product): number {
    if (p.currentStock === 0) return 0;
    // Si el stock es mayor al doble del mínimo, mostramos 100%
    const percent = (p.currentStock / (p.minStockAlert * 2)) * 100;
    return Math.min(percent, 100);
  }

  private saveProduct(productData: Product[]): void {
    this.productService.create(productData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Inventario Actualizado',
          timer: 1500,
          showConfirmButton: false
        });
        this.loadData();
      },
      error: () => Swal.fire('Error', 'No se pudo procesar la solicitud', 'error')
    });
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: "Se borrará el registro de stock permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(id).subscribe(() => {
          this.products = this.products.filter(p => p.id !== id);
          Swal.fire('Eliminado', 'Producto borrado.', 'success');
        });
      }
    });
  }
}