import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BundleDTO, BundleService } from '../../services/bundle-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bundle-list-component',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  standalone: true,
  templateUrl: './bundle-list-component.html',
  styleUrl: './bundle-list-component.scss',
})
export class BundleListComponent implements OnInit {
  bundles: BundleDTO[] = [];
  loading = false;

  constructor(
    private bundleService: BundleService,
    private router: Router,
        private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.loadBundles();
  }

  loadBundles(): void {
    this.loading = true;
    this.bundleService.getAll().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); // <-- Revisa la consola del navegador
        this.bundles = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar bundles', err);
        this.loading = false;
      }
    });

    this.cdr.detectChanges();
  }

  onEdit(id: number): void {
    this.router.navigate(['/bundles/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de eliminar este paquete? Esta acción no se puede deshacer.')) {
      this.bundleService.delete(id).subscribe(() => {
        this.bundles = this.bundles.filter(b => b.id !== id);
      });
    }
  }

  onCreateNew(): void {
    this.router.navigate(['/bundles']);
  }

  getTotalItems(bundle: BundleDTO): number {
  return bundle.items.reduce((acc, item) => acc + item.quantity, 0);
}


calculateItemsTotal(bundle: BundleDTO): number {
  if (!bundle || !bundle.items) return 0;
  return bundle.items.reduce((acc, item) => {
    // Aseguramos que los valores sean números para evitar NaN en el currency pipe
    const qty = Number(item.quantity) || 0;
    const price = Number(item.assignedUnitPrice) || 0;
    return acc + (qty * price);
  }, 0);
}

}