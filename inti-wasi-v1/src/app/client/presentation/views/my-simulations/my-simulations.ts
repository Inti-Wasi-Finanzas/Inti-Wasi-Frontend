import {Component, OnInit, inject, effect} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';
import {Router, RouterLink} from '@angular/router';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {SimulationStore} from '../../../../simulations/application/store/simulation-store';
import {AuthStore} from '../../../../auth/application/store/auth-store';
import {ClientStore} from '../../../application/store/client-store';

@Component({
  selector: 'app-my-simulations',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinner,
    MatError,
    MatIconModule,
    MatIcon,
    CommonModule
  ],
  templateUrl: './my-simulations.html',
  styleUrl: './my-simulations.css'
})


export class MySimulationsComponent implements OnInit {

  readonly store = inject(SimulationStore);
  private router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly clientStore = inject(ClientStore);

  // para no llamar loadSimulationsByClient varias veces
  private simulationsLoaded = false;

  displayedColumns: string[] = [
    'id',
    'programName',
    'propertyName',
    'amountFinanced',
    'monthlyFee',
    'estado',
    'actions'
  ];

  constructor() {
    // 👇 efecto reactivo: se ejecuta cada vez que cambie el client en el ClientStore
    effect(() => {
      const client = this.clientStore.client();

      // cuando ya tengamos el cliente y aún no hemos cargado simulaciones
      if (client && !this.simulationsLoaded) {
        this.simulationsLoaded = true;
        this.store.loadSimulationsByClient(client.id);
      }
    });
  }

  ngOnInit(): void {
    // Si en ClientStore ya llamas this.loadMyProfile() en el constructor,
    // no necesitas hacer nada aquí.
    // Si no, podrías asegurar:
    // this.clientStore.loadMyProfile();
  }

  editSimulation(simulationId: number): void {
    this.router.navigate(['/client/simulation-create'], {
      queryParams: { simulationId }
    });
  }

  delete(id: number): void {
    this.store.deleteSimulation(id);
  }

  logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
