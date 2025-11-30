import {Injectable, Signal, computed, signal} from '@angular/core';
import {SimulationsApi} from '../../infrastructure/api/simulations-api';
import {Simulation} from '../../domain/model/simulation.entity';
import {PaymentScheduleEntry} from '../../domain/model/payment-schedule-entry.entity';
import {retry} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class SimulationStore {

  private readonly simulationsSignal = signal<Simulation[]>([]);
  readonly simulations = this.simulationsSignal.asReadonly();

  private readonly currentSimulationSignal = signal<Simulation | null>(null);
  readonly currentSimulation = this.currentSimulationSignal.asReadonly();

  private readonly scheduleSignal = signal<PaymentScheduleEntry[]>([]);
  readonly schedule = this.scheduleSignal.asReadonly();

  readonly scheduleCount = computed(() => this.schedule().length);

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private simulationsApi: SimulationsApi) {
  }

  /**
   * Carga las simulaciones del cliente autenticado.
   * De momento se deja el clientId como argumento para
   * que tú lo obtengas del contexto de autenticación.
   */
  loadSimulationsByClient(clientId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.simulationsApi.getSimulationsByClient(clientId)
      .pipe(takeUntilDestroyed(), retry(1))
      .subscribe({
        next: sims => {
          this.simulationsSignal.set(sims);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load simulations'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Crea una nueva simulación (botón "Simular" en modo creación).
   */
  createSimulation(simulation: Simulation): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.simulationsApi.createSimulation(simulation)
      .pipe(retry(1))
      .subscribe({
        next: created => {
          this.currentSimulationSignal.set(created);
          this.simulationsSignal.update(list => [...list, created]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to create simulation'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Actualiza una simulación existente (botón "Simular" en modo edición
   * o "Guardar simulación" si ya existe).
   */
  updateSimulation(simulation: Simulation): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.simulationsApi.updateSimulation(simulation)
      .pipe(retry(1))
      .subscribe({
        next: updated => {
          this.currentSimulationSignal.set(updated);
          this.simulationsSignal.update(list =>
            list.map(s => s.id === updated.id ? updated : s)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update simulation'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Elimina una simulación (icono basura en Simulaciones guardadas).
   */
  deleteSimulation(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.simulationsApi.deleteSimulation(id)
      .pipe(retry(1))
      .subscribe({
        next: () => {
          this.simulationsSignal.update(list => list.filter(s => s.id !== id));
          if (this.currentSimulationSignal()?.id === id) {
            this.currentSimulationSignal.set(null);
          }
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete simulation'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Carga el cronograma de pagos (Ver Cronograma).
   */
  loadSchedule(simulationId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.simulationsApi.getSchedule(simulationId)
      .pipe(retry(1))
      .subscribe({
        next: schedule => {
          this.scheduleSignal.set(schedule);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load payment schedule'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Descarga el PDF del cronograma (Ver/Generar cronograma en PDF).
   */
  downloadSchedulePdf(simulationId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.simulationsApi.getSchedulePdf(simulationId)
      .pipe(retry(1))
      .subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to download schedule PDF'));
          this.loadingSignal.set(false);
        }
      });
  }

  setCurrentSimulation(simulation: Simulation | null): void {
    this.currentSimulationSignal.set(simulation);
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
