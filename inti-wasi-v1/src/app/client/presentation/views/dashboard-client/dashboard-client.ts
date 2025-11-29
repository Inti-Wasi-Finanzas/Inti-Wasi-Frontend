import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import { AuthStore } from '../../../../auth/application/store/auth-store';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  templateUrl: './dashboard-client.html',
  styleUrls: ['./dashboard-client.css'],
  imports: [RouterLink, MatIcon],
})
export class DashboardClientComponent {
  constructor(private authStore: AuthStore) {
  }

  logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
