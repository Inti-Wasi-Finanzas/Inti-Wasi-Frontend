import {Component, OnInit, inject} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';
import {Router, RouterLink} from '@angular/router';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {SimulationStore} from '../../../../simulations/application/store/simulation-store';
import {AuthStore} from '../../../../auth/application/store/auth-store';

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


  displayedColumns: string[] = [
    'id',
    'programName',
    'propertyName',
    'amountFinanced',
    'monthlyFee',
    'estado',
    'actions'
  ];

  ngOnInit(): void {
    const clientId = 1; // TODO: reemplazar por el cliente autenticado
    this.store.loadSimulationsByClient(clientId);
  }

  seeSummary(id: number): void {
    this.router.navigate(['/simulations/new'], {queryParams: {simulationId: id}}).then();
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
