import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-clients-list',
  imports: [MatIcon],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css',
})
export class ClientsListComponent {
  // Datos de clientes mockeados
  clientes = [
    { nombre: 'Juan Perez', dni: '45670982', email: 'juanperez@gmail.com', telefono: '968773241', ingresos: '3500' },
    { nombre: 'Alisson Gomez', dni: '04958632', email: 'alissongomez@gmail.com', telefono: '999352167', ingresos: '2300' },
    { nombre: 'Martin Velasquez', dni: '76352418', email: 'martinvelasquez@gmail.com', telefono: '977266387', ingresos: '1580' },
    { nombre: 'Pedro Ferran', dni: '02394586', email: 'pedroferran@gmail.com', telefono: '29183394', ingresos: '2190' }
  ];

  logout() {
    console.log('Cerrando sesión');
  }
}
