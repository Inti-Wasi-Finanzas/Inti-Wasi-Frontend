import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SimulationDetailComponent} from '../simulation-detail/simulation-detail';
import { RouterLink } from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';
import {MatDialog} from '@angular/material/dialog';
import {
  PaymentScheduleTable
} from '../../../../simulations/presentation/components/payment-schedule-table/payment-schedule-table';
import {SimulationsApi} from '../../../../simulations/infrastructure/api/simulations-api';
import {Simulation} from '../../../../simulations/domain/model/simulation.entity';
import {SimulationFormComponent} from '../../../../simulations/presentation/components/simulation-form/simulation-form';
import {MatIcon} from '@angular/material/icon';
import {AuthStore} from '../../../../auth/application/store/auth-store';

@Component({
  selector: 'app-simulation-create',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    SimulationFormComponent,
    SimulationDetailComponent,
    MatProgressSpinner,
    MatError,
    MatIcon
  ],
  templateUrl: './simulation-create.html',
  styleUrl: './simulation-create.css'
})
export class SimulationCreateComponent {

  private readonly authStore = inject(AuthStore);
  private api = inject(SimulationsApi);
  private dialog = inject(MatDialog);

  loading = false;
  error: string | null = null;
  lastSimulation: Simulation | null = null;

  onFormSubmit(payload: any): void {
    this.loading = true;
    this.error = null;
    this.lastSimulation = null;

    this.api.createSimulation(payload as any).subscribe({
      next: sim => {
        this.lastSimulation = sim;
        this.loading = false;
      },
      error: err => {
        this.error = err?.message || 'Error al crear simulación';
        this.loading = false;
      }
    });
  }

  onSeeSchedule(simulationId: number): void {
    this.dialog.open(PaymentScheduleTable, {
      width: '900px',
      data: {simulationId}
    });
  }

  logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
