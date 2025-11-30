import { Injectable, computed, signal } from '@angular/core';
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

  constructor(private clientApi: ClientApi) {
    this.loadMyProfile();
    this.loadAllClients();
  }

  /**
   * Carga el perfil del cliente autenticado.
   */
  loadMyProfile(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.clientApi.getMyProfile().pipe(takeUntilDestroyed()).subscribe({
      next: client => {
        this.clientSignal.set(client);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load client profile'));
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

    this.clientApi.getAllClients().pipe(takeUntilDestroyed()).subscribe({
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
  updateMyProfile(updatedClient: Client): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.clientApi.updateMyProfile(updatedClient).pipe(retry(1)).subscribe({
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
