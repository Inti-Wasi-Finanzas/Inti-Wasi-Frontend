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
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
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
      dni: ['', [Validators.required, Validators.minLength(8)], Validators.maxLength(8)],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required, Validators.minLength(9), Validators.maxLength(9)],
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
      deadlinesMonths: [0, [Validators.required, Validators.min(60), Validators.max(300)]],
      typeRate: ['TEA', Validators.required],
      interestRate: [14, [Validators.required, Validators.min(0)]],
      capitalization: ['MENSUAL', Validators.required],

      monthlyCommissions: [0, [Validators.min(0)]],
      mortgageInsuranceRate: [0.0003, [Validators.min(0)]],
      propertyInsurance: [0.030, [Validators.min(0)]],

      gracePeriodType: ['NINGUNO', Validators.required],
      gracePeriodMonths: [0, [Validators.min(0)]],
      dayOfPayment: ['2025-12-05', Validators.required]
    },
    {
        validators: [this.simulationBusinessValidator]
    }

    );
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.value);
  }


  private simulationBusinessValidator(group: AbstractControl): ValidationErrors | null {
    const errors: any = {};

    const programName = group.get('programName')?.value as ProgramaHabitacional;
    const typeBond = group.get('typeBond')?.value as TypeBond;
    const propertyType = group.get('propertyType')?.value as PropertyType;

    const propertyPrice = Number(group.get('propertyPrice')?.value ?? 0);
    const percentageDownPayment = Number(group.get('percentageDownPayment')?.value ?? 0);

    const monthlyIncome = Number(group.get('monthlyIncome')?.value ?? 0);
    const spouseIncomes = Number(group.get('spouseIncomes')?.value ?? 0);
    const totalIncome = monthlyIncome + spouseIncomes;

    const totalMonthlyDebtPayments = Number(group.get('totalMonthlyDebtPayments')?.value ?? 0);
    const negativeRecordSbs = !!group.get('negativeRecordSbs')?.value;
    const hasOtherProperty = !!group.get('hasOtherProperty')?.value;
    const receivedBonoBeforeFMV = !!group.get('receivedBonoBeforeFMV')?.value;

    const birthDateRaw = group.get('birthDate')?.value as string | null;

    // =========================
    // 1) Condiciones duras
    // =========================

    // a) Mayor de edad
    if (birthDateRaw) {
      const birth = new Date(birthDateRaw);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 18) {
        errors.underAge = { minAge: 18, currentAge: age };
      }
    }

    // b) SBS negativo
    if (negativeRecordSbs) {
      errors.negativeRecordSbs = true;
    }

    // c) Otra propiedad
    if (hasOtherProperty) {
      errors.hasOtherProperty = true;
    }

    // d) Recibió bono FMV antes
    if (receivedBonoBeforeFMV) {
      errors.receivedBonoBeforeFMV = true;
    }

    // =========================
    // 2) Límite de deuda (30% ingreso familiar)
    // =========================
    if (totalIncome > 0 && totalMonthlyDebtPayments > 0) {
      const maxDebt = totalIncome * 0.3;
      if (totalMonthlyDebtPayments > maxDebt) {
        errors.debtLimit = {
          maxAllowed: maxDebt,
          currentDebt: totalMonthlyDebtPayments
        };
      }
    }

    // =========================
    // 3) Reglas por programa
    // =========================

    // ----- MiVivienda -----
    if (programName === 'NUEVO_CREDITO_MIVIVIENDA') {
      const minPrice = 68800;
      const maxPrice = 362100;

      // MV1) Rango de precio
      if (propertyPrice < minPrice || propertyPrice > maxPrice) {
        errors.mvPriceRange = { min: minPrice, max: maxPrice };
      }

      // MV2) Ingreso familiar > 3715
      if (totalIncome <= 3715) {
        errors.mvIncomeMin = { min: 3715, totalIncome };
      }

      // MV3) Cuota inicial mínima 7.5%
      if (percentageDownPayment < 7.5) {
        errors.mvDownPaymentMin = { min: 7.5, percentageDownPayment };
      }
    }

    // ----- Techo Propio -----
    if (programName === 'TECHO_PROPIO') {

      // TP1) Ingreso familiar máximo 3715
      if (totalIncome > 3715) {
        errors.tpIncomeMax = { max: 3715, totalIncome };
      }

      // TP3) Precio máximo 130,500
      if (propertyPrice > 130500) {
        errors.tpPriceMax = { max: 130500, propertyPrice };
      }

      // 1) precio <= 70,000 → ingresos <= 2,720
      if (propertyPrice <= 70000 && totalIncome > 2720) {
        errors.tpIncomeTooHighForLowPrice = {
          maxIncome: 2720,
          totalIncome
        };
      }

      // 2) 70,000 < precio <= 130,500 → ingresos entre 2,720 y 3,715
      if (propertyPrice > 70000 && propertyPrice <= 130500) {
        if (totalIncome < 2720 || totalIncome > 3715) {
          errors.tpIncomeRangeForMidPrice = {
            minIncome: 2720,
            maxIncome: 3715,
            totalIncome
          };
        }
      }

      // TP2a) VIS priorizada: precio <= 70,000 e ingreso < 2,720
      //      cuota inicial entre 1% y 3%
      if (propertyPrice <= 70000 && totalIncome < 2720) {
        if (percentageDownPayment < 1 || percentageDownPayment > 3) {
          errors.tpVisPriorizadaDownPayment = {
            min: 1,
            max: 3,
            percentageDownPayment
          };
        }
      }

      // TP2b) VIS regular: 70,000 < precio <= 130,500
      //     e ingreso entre 2,720 y 3,715 → cuota inicial >= 3%
      if (propertyPrice > 70000 &&
        propertyPrice <= 130500 &&
        totalIncome >= 2720 &&
        totalIncome <= 3715) {

        if (percentageDownPayment < 3) {
          errors.tpVisRegularDownPaymentMin = {
            min: 3,
            percentageDownPayment
          };
        }
      }
    }

    return Object.keys(errors).length ? errors : null;
  }


}
