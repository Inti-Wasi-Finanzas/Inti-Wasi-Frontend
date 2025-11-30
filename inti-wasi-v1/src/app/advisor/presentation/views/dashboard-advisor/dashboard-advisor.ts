import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { AuthStore } from '../../../../auth/application/store/auth-store';

@Component({
  selector: 'app-dashboard-advisor',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './dashboard-advisor.html',
  styleUrl: './dashboard-advisor.css',
})
export class DashboardAdvisorComponent {
  constructor(public authStore: AuthStore) {}

  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}


