import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category';
import Swal from 'sweetalert2'; // Opcional para alertas bonitas
import { Category } from '../../models/categoryModels';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-category',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, MatChipsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit{
  categories: Category[] = [];

  constructor(private service: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.service.getAll().subscribe(data => this.categories = data);
  }

  edit(category: Category) {
  this.openModal(category);
}

  async openModal(category?: Category) {
    const { value: name } = await Swal.fire({
  title: 'Nueva Categoría',
  input: 'text',
  confirmButtonText: 'Guardar',
  confirmButtonColor: '#0d6efd', // El azul de tu botón primary
  cancelButtonText: 'Cancelar',
  customClass: {
    popup: 'rounded-4 shadow-lg',
    confirmButton: 'btn btn-primary rounded-pill px-4',
    cancelButton: 'btn btn-light rounded-pill px-4'
  },
  buttonsStyling: false, // Permite que use las clases de Bootstrap
  inputValidator: (value: any) => !value ? '¡El nombre es obligatorio!' : null

});
    if (name) {
      const obs = category 
        ? this.service.update(category.id!, { name }) 
        : this.service.create({ name });

      obs.subscribe(() => this.loadCategories());
    }
  }

  delete(id: number) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.service.delete(id).subscribe(() => this.loadCategories());
    }
  }
  
}
