import { Component } from '@angular/core';
import {DecimalPipe, NgFor, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {AuthStore} from '../../../../auth/application/store/auth-store';

interface Client {
  id: number;
  fullName: string;
  dni: string;
  email: string;
  phoneNumber: string;
  monthlyIncome: number;
}

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [RouterLink, NgFor, DecimalPipe, MatIcon],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css',
})
export class ClientsListComponent {
  clients: Client[] = [
    {
      id: 1,
      fullName: 'Juan Perez',
      dni: '45708762',
      email: 'mj@gmail.com',
      phoneNumber: '968772341',
      monthlyIncome: 2500,
    },
    {
      id: 2,
      fullName: 'Alisson Gomez',
      dni: '42158793',
      email: 'ag@gmail.com',
      phoneNumber: '987654321',
      monthlyIncome: 2200,
    },
    {
      id: 3,
      fullName: 'Martin Velasquez',
      dni: '74583428',
      email: 'mv@gmail.com',
      phoneNumber: '277663387',
      monthlyIncome: 5180,
    },
    {
      id: 4,
      fullName: 'Pedro Ferran',
      dni: '41658231',
      email: 'pf@gmail.com',
      phoneNumber: '291933404',
      monthlyIncome: 3200,
    },
  ];

  constructor(private router: Router, private authStore: AuthStore) {}


  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
