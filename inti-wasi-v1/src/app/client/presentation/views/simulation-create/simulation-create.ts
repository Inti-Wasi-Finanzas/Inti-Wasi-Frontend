import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SimulationDetailComponent} from '../simulation-detail/simulation-detail';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
import {Subject, takeUntil} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

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
export class SimulationCreateComponent implements  OnInit, OnDestroy {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private api = inject(SimulationsApi);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private destroy$ = new Subject<void>();

  loading = false;
  error: string | null = null;
  lastSimulation: Simulation | null = null;

  isEditMode = false;


  ngOnInit(): void {
    // Escucha cambios en queryParams (importantísimo para cuando vienes de "editar")
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const simulationId = params['simulationId'];
        if (simulationId) {
          this.isEditMode = true;
          this.loadSimulation(+simulationId);
        } else {
          this.isEditMode = false;
          this.lastSimulation = null; // nueva simulación limpia
        }
      });
  }

  private loadSimulation(id: number): void {
    this.loading = true;
    this.error = null;

    this.api.getSimulation(id).subscribe({
      next: (sim) => {
        this.lastSimulation = sim;
        this.loading = false;
        console.log('Simulacion cargada para edición:', sim);
      },
      error: (err) => {
        this.error = 'No se pudo cargar la simulación para editar';
        this.loading = false;
      }
    });
  }



  onFormSubmit(payload: any): void {
    this.loading = true;
    this.error = null;

    const user = this.authStore.user(); // viene del AuthStore

    const enrichedPayload = {
      ...payload,
      clientId: user?.id ?? null,  // cliente autenticado
      advisorId: null              // sin asesor asignado, disponible para todos
    };

    this.api.createSimulation(enrichedPayload).subscribe({
      next: (sim) => {
        Promise.resolve().then(() => {
          this.lastSimulation = sim;
          this.loading = false;
          this.isEditMode = false;

          this.snackBar.open('Simulación generada correctamente', 'Cerrar', {
            duration: 3000
          });
        });
      },
      error: (err) => {
        Promise.resolve().then(() => {
          this.error = err?.message || 'Error al guardar la simulacion';
          this.loading = false;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
