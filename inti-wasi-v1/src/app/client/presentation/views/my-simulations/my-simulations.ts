import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgClass, DecimalPipe  } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {AuthStore} from '../../../../auth/application/store/auth-store';

type SimulationStatus = 'PROSPECTO' | 'EN_EVALUACION' | 'APROBADO' | 'RECHAZADO';

interface SavedSimulation {
  id: number;
  fullName: string;
  dni: string;
  phoneNumber: string;
  monthlyIncome: number;
  status: SimulationStatus;
}

@Component({
  selector: 'app-my-simulations',
  imports: [RouterLink, NgFor, NgClass, DecimalPipe, MatIcon],
  standalone: true,
  templateUrl: './my-simulations.html',
  styleUrl: './my-simulations.css',
})
export class MySimulationsComponent {
  simulations: SavedSimulation[] = [
    {
      id: 1,
      fullName: 'Juan Pérez García',
      dni: '12345678',
      phoneNumber: '987654321',
      monthlyIncome: 2500,
      status: 'PROSPECTO',
    },
    {
      id: 2,
      fullName: 'Juan Pérez García',
      dni: '12345678',
      phoneNumber: '987654321',
      monthlyIncome: 3800,
      status: 'EN_EVALUACION',
    },
  ];

  constructor(private router: Router, private authStore: AuthStore) {}

  // Navegar a "Nueva Simulación" para editar esta simulación
  onEdit(sim: SavedSimulation): void {
    this.router.navigate(['/client/new-simulation'], {
      queryParams: { id: sim.id }, // luego en el futuro cargas desde backend usando este id
      state: { fromSaved: true },
    });
  }

  // Eliminar de la lista (por ahora solo en memoria, luego se conecta al backend)
  onDelete(sim: SavedSimulation): void {
    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar la simulación de ${sim.fullName}?`
    );
    if (!confirmDelete) {
      return;
    }

    this.simulations = this.simulations.filter((s) => s.id !== sim.id);
  }

  // Helpers para mostrar el estado con texto y clase CSS

  getStatusLabel(status: SimulationStatus): string {
    switch (status) {
      case 'PROSPECTO':
        return 'Prospecto';
      case 'EN_EVALUACION':
        return 'En evaluación';
      case 'APROBADO':
        return 'Aprobado';
      case 'RECHAZADO':
        return 'Rechazado';
      default:
        return status;
    }
  }

  getStatusClass(status: SimulationStatus): string {
    switch (status) {
      case 'PROSPECTO':
        return 'status-prospecto';
      case 'EN_EVALUACION':
        return 'status-evaluacion';
      case 'APROBADO':
        return 'status-aprobado';
      case 'RECHAZADO':
        return 'status-rechazado';
      default:
        return '';
    }
  }


  logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
