import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  iconClass: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  navItems: NavItem[] = [
    { label: 'Inicio', iconClass: 'fas fa-home-alt', link: '/inicio' },
    { label: 'Productos', iconClass: 'fas fa-box-open', link: '/products' },
    { label: 'Categorías', iconClass: 'fas fa-tags', link: '/category' },
    { label: 'Adquisiciones', iconClass: 'fas fa-shopping-cart', link: '/purchases' },
    { label: 'Paquetes', iconClass: 'fas fa-cubes', link: '/bundles' },
    { label: 'Precios', iconClass: 'fas fa-money-bill-wave', link: '/price-rules' },
    { label: 'Clientes', iconClass: 'fas fa-users', link: '/customers' },
    { label: 'Ventas', iconClass: 'fas fa-chart-line', link: '/sales-list' },
    { label: 'Vender', iconClass: 'fas fa-chart-line', link: '/sales' },    
    { label: 'Inventario', iconClass: 'fas fa-warehouse', link: '/inventario' },
    { label: 'Reportes', iconClass: 'fas fa-file-alt', link: '/reportes' },
    { label: 'Configuración', iconClass: 'fas fa-cog', link: '/configuracion' },
  ];

  @Output() closeMenuEmit = new EventEmitter<void>();

  closeMenu() {
    this.closeMenuEmit.emit();
  }
}
