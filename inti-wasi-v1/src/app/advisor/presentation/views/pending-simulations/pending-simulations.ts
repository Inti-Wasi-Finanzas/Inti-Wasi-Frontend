import {Component, inject, OnInit} from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AuthStore} from '../../../../auth/application/store/auth-store';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {PendingSimulationsStore} from '../../../application/store/pending-simulations-store';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-pending-simulations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinner,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule
  ],
  templateUrl: './pending-simulations.html',
  styleUrl: './pending-simulations.css',
})
export class PendingSimulationsComponent implements OnInit {

  readonly store = inject(PendingSimulationsStore);
  private readonly authStore = inject(AuthStore);

  private readonly advisorId = 2;

  displayedColumns = [
    'id',
    'client',
    'program',
    'amountFinanced',
    'monthlyFee',
    'fecha',
    'actions'
  ];

  ngOnInit(): void {
    this.store.loadPending(this.advisorId);
  }

  approve(simulationId: number): void {
    this.store.approve(simulationId, this.advisorId);
  }

  reject(simulationId: number): void {
    const reason = prompt('Ingrese el motivo del rechazo:');
    if (!reason || !reason.trim()) {
      return;
    }
    this.store.reject(simulationId, this.advisorId, reason.trim());
  }

  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}

