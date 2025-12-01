import {Component, computed, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Simulation} from '../../../../simulations/domain/model/simulation.entity';
import {SimulationStore} from '../../../../simulations/application/store/simulation-store';

@Component({
  selector: 'app-simulation-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './simulation-detail.html',
  styleUrl: './simulation-detail.css'
})
export class SimulationDetailComponent {

  @Input() simulation: Simulation | null = null;
  @Output() seeSchedule = new EventEmitter<number>();
  @Output() downloadPdf = new EventEmitter<number>();

  // Aquí usamos computed() para leer los valores reactivos del Signal
  error = computed(() => this.simulationStore.error());

  constructor(private simulationStore: SimulationStore) {}

  onSeeSchedule(): void {
    if (this.simulation) {
      this.seeSchedule.emit(this.simulation.id);
    }
  }

  onDownloadPdf(simulationId: number): void {
    this.simulationStore.downloadSchedulePdf(simulationId);
    this.downloadPdf.emit(simulationId);  // Emitir el evento cuando se hace clic en "Generar PDF"
  }

}
