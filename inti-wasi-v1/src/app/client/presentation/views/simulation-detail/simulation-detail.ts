import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Simulation} from '../../../../simulations/domain/model/simulation.entity';

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

  onSeeSchedule(): void {
    if (this.simulation) {
      this.seeSchedule.emit(this.simulation.id);
    }
  }
}
