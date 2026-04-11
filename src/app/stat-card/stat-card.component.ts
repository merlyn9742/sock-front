import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {

  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() iconClass: string = ''; // Clase del icono (ej. 'fas fa-box')
  @Input() iconColor: string = 'gray'; // Color del icono
  @Input() iconBgColor: string = 'lightgray'; // Color de fondo del icono

}
