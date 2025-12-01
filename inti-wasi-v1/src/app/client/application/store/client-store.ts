import {Injectable, computed, signal, inject, DestroyRef} from '@angular/core';
import { Client } from '../../domain/model/client.entity';
import { ClientApi } from '../../infrastructure/api/client-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientStore {

  private readonly clientSignal = signal<Client | null>(null);
  readonly client = this.clientSignal.asReadonly();

  private readonly clientsSignal = signal<Client[]>([]);
  readonly clients = this.clientsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly hasProfile = computed(() => this.client() !== null);

  private readonly destroyRef = inject(DestroyRef);

  constructor(private clientApi: ClientApi) {
    //this.loadMyProfile();
    //this.loadAllClients();
  }

  /**
   * Carga el perfil del cliente autenticado.
   */
  loadMyProfile(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.clientApi.getMyProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: client => {
          this.clientSignal.set(client);
          this.loadingSignal.set(false);
        },
        error: err => {
          // Si el backend responde 401/404 es probable que todavía
          // no exista perfil de cliente para este usuario.
          if (err.status === 401 || err.status === 404) {
            console.warn('No hay perfil de cliente aún. Se creará al guardar.', err);
            this.clientSignal.set(null);
          } else {
            this.errorSignal.set(this.formatError(err, 'Failed to load client profile'));
          }
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Carga todos los clientes (para el advisor).
   */
  loadAllClients(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.clientApi.getAllClients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: clients => {
          this.clientsSignal.set(clients);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load clients list'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Actualiza el perfil del cliente autenticado.
   */
  /**
   * Crea/actualiza el perfil del cliente autenticado.
   * El backend usa el userId del token, no el id del payload.
   */
  updateMyProfile(updatedClient: Client): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.clientApi.updateMyProfile(updatedClient)
      .pipe(retry(1))
      .subscribe({
        next: client => {
          this.clientSignal.set(client);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update client profile'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Formatea mensajes de error de forma amigable.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
