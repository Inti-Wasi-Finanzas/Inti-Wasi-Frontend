import {Component, inject, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {SimulationStore} from '../../../application/store/simulation-store';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';
import {CommonModule, DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-payment-schedule-table',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule,
    MatProgressSpinner,
    MatError,
    CommonModule,
    DatePipe,
    MatButtonModule
  ],
  templateUrl: './payment-schedule-table.html',
  styleUrl: './payment-schedule-table.css'
})

export class PaymentScheduleTable implements OnInit {

  private readonly simulationStore = inject(SimulationStore);
  readonly store = this.simulationStore;

  displayedColumns: string[] = [
    'installmentNumber',
    'dueDate',
    'teaAnnual',
    'tepPeriod',
    'beginningBalance',
    'interest',
    'installmentWithSegDes',
    'amortization',
    'seguroDesgravamen',
    'comision',
    'endingBalance',
    'flujo'
  ];

  constructor(
    private dialogRef: MatDialogRef<PaymentScheduleTable>,
    @Inject(MAT_DIALOG_DATA) public data: { simulationId: number }
  ) {}

  ngOnInit(): void {
    if (this.data.simulationId) {
      this.store.loadSchedule(this.data.simulationId);
    }
  }
}
