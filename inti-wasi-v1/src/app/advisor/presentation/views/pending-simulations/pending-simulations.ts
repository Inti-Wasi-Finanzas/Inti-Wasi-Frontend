import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AuthStore} from '../../../../auth/application/store/auth-store';

@Component({
  selector: 'app-pending-simulations',
  standalone: true,
    imports: [
        MatIcon,
        RouterLink
    ],
  templateUrl: './pending-simulations.html',
  styleUrl: './pending-simulations.css',
})
export class PendingSimulationsComponent {

  private readonly authStore = inject(AuthStore);

  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}

