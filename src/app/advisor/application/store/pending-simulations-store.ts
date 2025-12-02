import {Injectable, Signal, computed, signal, inject, DestroyRef} from '@angular/core';

import {retry} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Simulation} from '../../../simulations/domain/model/simulation.entity';
import {SimulationsApi} from '../../../simulations/infrastructure/api/simulations-api';

@Injectable({
  providedIn: 'root'
})
export class PendingSimulationsStore {

  private readonly pendingSignal = signal<Simulation[]>([]);
  readonly pending: Signal<Simulation[]> = this.pendingSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  private readonly destroyRef = inject(DestroyRef);

  constructor(private simulationsApi: SimulationsApi) {}

  loadPending(advisorId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.simulationsApi.getPendingSimulationsByAdvisor(advisorId)
      .pipe(takeUntilDestroyed(this.destroyRef), retry(1))
      .subscribe({
        next: sims => {
          this.pendingSignal.set(sims);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set('Error al cargar simulaciones pendientes');
          this.loadingSignal.set(false);
        }
      });
  }

  approve(simulationId: number, advisorId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.simulationsApi.approveSimulation(simulationId, advisorId)
      .pipe(retry(1))
      .subscribe({
        next: updated => {
          this.pendingSignal.update(list =>
            list.map(s => s.id === updated.id ? updated : s)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set('Error al aprobar la simulación');
          this.loadingSignal.set(false);
        }
      });
  }

  reject(simulationId: number, advisorId: number, reason: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.simulationsApi.rejectSimulation(simulationId, advisorId, reason)
      .pipe(retry(1))
      .subscribe({
        next: updated => {
          this.pendingSignal.update(list =>
            list.map(s => s.id === updated.id ? updated : s)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set('Error al rechazar la simulación');
          this.loadingSignal.set(false);
        }
      });
  }
}
