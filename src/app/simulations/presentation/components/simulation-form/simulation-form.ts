import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  Capitalization,
  CivilStatus,
  Currency,
  FinancialInstitution,
  GracePeriodType,
  IncomeProof,
  JobType,
  ProgramaHabitacional,
  PropertyType,
  Simulation,
  TypeBond
} from '../../../domain/model/simulation.entity';
import {ClientStore} from '../../../../client/application/store/client-store';

@Component({
  selector: 'app-simulation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './simulation-form.html',
  styleUrl: './simulation-form.css'
})
export class SimulationFormComponent implements OnInit, OnChanges {

  @Input() initialData: Simulation | null = null;
  @Input() isEditMode = false;
  @Output() submitted = new EventEmitter<any>();
  @Output() formChanged = new EventEmitter<any>();

  programs: ProgramaHabitacional[] = ['NUEVO_CREDITO_MIVIVIENDA', 'TECHO_PROPIO'];
  currencies: Currency[] = ['SOLES', 'DOLARES'];
  civilStatuses: CivilStatus[] = ['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO'];
  jobTypes: JobType[] = ['DEPENDIENTE', 'INDEPENDIENTE', 'RENTISTA', 'JUBILADO'];
  incomeProofs: IncomeProof[] = ['BOLETA_PAGO', 'RECIBO_HONORARIOS', 'DECLARACION_JURADA', 'RUC', 'OTROS'];
  propertyTypes: PropertyType[] = ['CASA', 'DEPARTAMENTO'];
  typeBonds: TypeBond[] = ['BBP_TRADICIONAL', 'BBP_SOSTENIBLE', 'BFH', 'NINGUNO'];
  financialInstitutions: FinancialInstitution[] = ['BCP', 'BBVA', 'INTERBANK'];
  capitalizations: Capitalization[] = ['MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL', 'DIARIA'];
  graceTypes: GracePeriodType[] = ['NINGUNO', 'TOTAL', 'PARCIAL'];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientStore: ClientStore
  ) {
    this.form = this.createForm();

    // 👇 Reacciona a los cambios del Signal client()
    effect(() => {
      const client = this.clientStore.client();   // Signal → se lee como función

      if (client) {
        // Solo parcheamos el clientId, sin disparar valueChanges
        this.form.patchValue(
          { clientId: client.id },
          { emitEvent: false }
        );
      }
    });

    // Emitimos cambios del form hacia arriba (por si usas formChanged)
    this.form.valueChanges.subscribe(v => this.formChanged.emit(v));
  }

  ngOnInit(): void {
    // Cargar el perfil del cliente autenticado
    this.clientStore.loadMyProfile();

    // Si vienes en modo edición y ya hay initialData
    if (this.initialData) {
      this.form.patchValue(this.initialData);
      console.log('Formulario rellenado con initialData:', this.initialData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.initialData) {
      console.log('🔄 initialData cambió, parcheando formulario:', this.initialData);
      this.form.patchValue(this.initialData);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Este lo llenamos con el ClientStore
      clientId: [null, Validators.required],

      // El backend ignora advisorId al crear, así que puede ir null
      advisorId: [2],

      programName: ['NUEVO_CREDITO_MIVIVIENDA', Validators.required],
      currency: ['SOLES', Validators.required],

      fullName: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],

      civilStatus: ['SOLTERO', Validators.required],
      dependents: [0, [Validators.min(0)]],

      jobType: ['DEPENDIENTE', Validators.required],
      jobMonths: [0, [Validators.min(0)]],
      incomeProof: ['BOLETA_PAGO', Validators.required],
      monthlyIncome: [0, [Validators.required, Validators.min(0)]],
      spouseIncomes: [0, [Validators.min(0)]],

      hasCurrentDebt: [false],
      totalMonthlyDebtPayments: [0, [Validators.min(0)]],
      negativeRecordSbs: [false],

      hasOtherProperty: [false],
      receivedBonoBeforeFMV: [false],
      typeBond: ['BBP_TRADICIONAL', Validators.required],

      propertyName: ['', Validators.required],
      propertyLocation: ['', Validators.required],
      propertyDepartment: ['', Validators.required],
      propertyDistrict: ['', Validators.required],
      propertyType: ['DEPARTAMENTO', Validators.required],
      propertyPrice: [200000, [Validators.required, Validators.min(0)]],
      isPropertySustainable: [false],

      hasDownPayment: [true],
      percentageDownPayment: [10, [Validators.min(0), Validators.max(100)]],

      financialInstitution: ['BCP', Validators.required],
      deadlinesMonths: [0, [Validators.required, Validators.min(1)]],
      typeRate: ['TEA', Validators.required],
      interestRate: [14, [Validators.required, Validators.min(0)]],
      capitalization: ['MENSUAL', Validators.required],

      monthlyCommissions: [0, [Validators.min(0)]],
      mortgageInsuranceRate: [0.0003, [Validators.min(0)]],
      propertyInsurance: [0.030, [Validators.min(0)]],

      gracePeriodType: ['NINGUNO', Validators.required],
      gracePeriodMonths: [0, [Validators.min(0)]],
      dayOfPayment: ['2025-12-05', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.value);
  }
}
