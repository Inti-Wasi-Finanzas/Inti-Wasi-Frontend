import {BaseEntity} from '../../../shared/infrastructure/api/base-entity';
import {PaymentScheduleEntry} from './payment-schedule-entry.entity';

export type ProgramaHabitacional = 'NUEVO_CREDITO_MIVIVIENDA' | 'TECHO_PROPIO';
export type Currency = 'SOLES' | 'DOLARES';
export type CivilStatus = 'SOLTERO' | 'CASADO' | 'DIVORCIADO' | 'VIUDO';
export type TypeBond = 'BBP_TRADICIONAL' | 'BBP_SOSTENIBLE' | 'BFH' | 'NINGUNO';
export type PropertyType = 'CASA' | 'DEPARTAMENTO';
export type FinancialInstitution = 'BCP' | 'BBVA' | 'INTERBANK';
export type Capitalization = 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL' | 'DIARIA';
export type EstadoSimulacion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
export type JobType = 'DEPENDIENTE' | 'INDEPENDIENTE' | 'RENTISTA' | 'JUBILADO';
export type IncomeProof = 'BOLETA_PAGO' | 'RECIBO_HONORARIOS' | 'DECLARACION_JURADA' | 'RUC' | 'OTROS';
export type GracePeriodType = 'NINGUNO' | 'TOTAL' | 'PARCIAL';

export class Simulation implements BaseEntity {

  // ===== BASE INFO =====

  private _id: number;
  private _clientId: number;
  private _advisorId: number | null;

  private _programName: ProgramaHabitacional;
  private _currency: Currency;

  private _fullName: string;
  private _dni: string;
  private _birthDate: string;
  private _email: string;
  private _phoneNumber: string;
  private _address: string;

  private _civilStatus: CivilStatus;
  private _dependents: number | null;

  // ===== EMPLOYMENT =====

  private _jobType: JobType;
  private _jobMonths: number | null;
  private _incomeProof: IncomeProof;

  private _monthlyIncome: number;
  private _spouseIncomes: number;
  private _totalFamilyIncome: number;

  private _hasCurrentDebt: boolean;
  private _totalMonthlyDebtPayments: number;
  private _negativeRecordSbs: boolean;

  // ===== PROPERTY =====

  private _hasOtherProperty: boolean;
  private _receivedBonoBeforeFMV: boolean;
  private _typeBond: TypeBond;

  private _propertyName: string;
  private _propertyLocation: string;
  private _propertyDepartment: string;
  private _propertyDistrict: string;
  private _propertyType: PropertyType | null;
  private _propertyPrice: number;
  private _isPropertySustainable: boolean;

  // ===== DOWN PAYMENT =====

  private _hasDownPayment: boolean;
  private _percentageDownPayment: number;
  private _downPaymentAmount: number;

  // ===== FINANCIAL =====

  private _financialInstitution: FinancialInstitution | null;
  private _deadlinesMonths: number | null;
  private _typeRate: string;
  private _interestRate: number;
  private _capitalization: Capitalization | null;

  private _monthlyCommissions: number;
  private _mortgageInsuranceRate: number;
  private _propertyInsurance: number;

  private _gracePeriodType: GracePeriodType;
  private _gracePeriodMonths: number;
  private _dayOfPayment: string;

  // ===== RESULTS FROM BACKEND =====

  private _amountBond: number;
  private _amountFinanced: number;
  private _monthlyFee: number;

  private _van: number | null;
  private _tir: number | null;
  private _tcea: number | null;

  private _estado: EstadoSimulacion;
  private _rejectionReason: string | null;
  private _simulationDate: string;

  // ===== SCHEDULE =====

  private _schedule: PaymentScheduleEntry[] = [];

  constructor(sim: {
    // REQUIRED FIELDS FOR BOTH CREATION AND BACKEND RESPONSE
    id: number;
    clientId: number;
    advisorId?: number | null;

    programName: ProgramaHabitacional;
    currency: Currency;

    fullName: string;
    dni: string;
    birthDate: string;
    email: string;
    phoneNumber: string;

    civilStatus: CivilStatus;
    totalFamilyIncome?: number;

    hasOtherProperty?: boolean;
    receivedBonoBeforeFMV?: boolean;
    typeBond?: TypeBond;

    propertyName?: string;
    propertyPrice?: number;
    isPropertySustainable?: boolean;

    financialInstitution?: FinancialInstitution | null;
    deadlinesMonths?: number | null;
    typeRate?: string;
    interestRate?: number;
    capitalization?: Capitalization | null;

    downPaymentAmount?: number;
    amountBond?: number;
    amountFinanced?: number;
    monthlyFee?: number;

    van?: number | null;
    tir?: number | null;
    tcea?: number | null;

    estado?: EstadoSimulacion;
    rejectionReason?: string | null;
    simulationDate?: string;

    // OPTIONAL (ONLY FOR CREATION)
    address?: string;
    dependents?: number | null;

    jobType?: JobType;
    jobMonths?: number | null;
    incomeProof?: IncomeProof;

    monthlyIncome?: number;
    spouseIncomes?: number;

    hasCurrentDebt?: boolean;
    totalMonthlyDebtPayments?: number;
    negativeRecordSbs?: boolean;

    propertyLocation?: string;
    propertyDepartment?: string;
    propertyDistrict?: string;
    propertyType?: PropertyType | null;

    hasDownPayment?: boolean;
    percentageDownPayment?: number;

    monthlyCommissions?: number;
    mortgageInsuranceRate?: number;
    propertyInsurance?: number;

    gracePeriodType?: GracePeriodType;
    gracePeriodMonths?: number;
    dayOfPayment?: string;

    schedule?: PaymentScheduleEntry[];
  }) {
    // ===== BASE INFO =====
    this._id = sim.id;
    this._clientId = sim.clientId;
    this._advisorId = sim.advisorId ?? null;

    this._programName = sim.programName;
    this._currency = sim.currency;

    this._fullName = sim.fullName;
    this._dni = sim.dni;
    this._birthDate = sim.birthDate;
    this._email = sim.email;
    this._phoneNumber = sim.phoneNumber;
    this._address = sim.address ?? '';

    this._civilStatus = sim.civilStatus;
    this._dependents = sim.dependents ?? null;

    // ===== EMPLOYMENT =====
    this._jobType = sim.jobType ?? 'DEPENDIENTE';
    this._jobMonths = sim.jobMonths ?? null;
    this._incomeProof = sim.incomeProof ?? 'BOLETA_PAGO';

    this._monthlyIncome = sim.monthlyIncome ?? 0;
    this._spouseIncomes = sim.spouseIncomes ?? 0;
    this._totalFamilyIncome = sim.totalFamilyIncome ?? 0;

    this._hasCurrentDebt = sim.hasCurrentDebt ?? false;
    this._totalMonthlyDebtPayments = sim.totalMonthlyDebtPayments ?? 0;
    this._negativeRecordSbs = sim.negativeRecordSbs ?? false;

    // ===== PROPERTY =====
    this._hasOtherProperty = sim.hasOtherProperty ?? false;
    this._receivedBonoBeforeFMV = sim.receivedBonoBeforeFMV ?? false;
    this._typeBond = sim.typeBond ?? 'NINGUNO';

    this._propertyName = sim.propertyName ?? '';
    this._propertyLocation = sim.propertyLocation ?? '';
    this._propertyDepartment = sim.propertyDepartment ?? '';
    this._propertyDistrict = sim.propertyDistrict ?? '';
    this._propertyType = sim.propertyType ?? null;
    this._propertyPrice = sim.propertyPrice ?? 0;
    this._isPropertySustainable = sim.isPropertySustainable ?? false;

    // ===== DOWN PAYMENT =====
    this._hasDownPayment = sim.hasDownPayment ?? false;
    this._percentageDownPayment = sim.percentageDownPayment ?? 0;
    this._downPaymentAmount = sim.downPaymentAmount ?? 0;

    // ===== FINANCIAL =====
    this._financialInstitution = sim.financialInstitution ?? null;
    this._deadlinesMonths = sim.deadlinesMonths ?? null;
    this._typeRate = sim.typeRate ?? 'TEA';
    this._interestRate = sim.interestRate ?? 0;
    this._capitalization = sim.capitalization ?? null;

    this._monthlyCommissions = sim.monthlyCommissions ?? 0;
    this._mortgageInsuranceRate = sim.mortgageInsuranceRate ?? 0;
    this._propertyInsurance = sim.propertyInsurance ?? 0;

    this._gracePeriodType = sim.gracePeriodType ?? 'NINGUNO';
    this._gracePeriodMonths = sim.gracePeriodMonths ?? 0;
    this._dayOfPayment = sim.dayOfPayment ?? new Date().toISOString().substring(0, 10);

    // ===== BACKEND RESULTS =====
    this._amountBond = sim.amountBond ?? 0;
    this._amountFinanced = sim.amountFinanced ?? 0;
    this._monthlyFee = sim.monthlyFee ?? 0;

    this._van = sim.van ?? null;
    this._tir = sim.tir ?? null;
    this._tcea = sim.tcea ?? null;

    this._estado = sim.estado ?? 'PENDIENTE';
    this._rejectionReason = sim.rejectionReason ?? null;
    this._simulationDate = sim.simulationDate ?? new Date().toISOString().substring(0, 10);

    this._schedule = sim.schedule ?? [];
  }

  // ===== GETTERS & SETTERS =====

  get id() { return this._id; }
  set id(v: number) { this._id = v; }

  get clientId() { return this._clientId; }
  set clientId(v: number) { this._clientId = v; }

  get advisorId() { return this._advisorId; }
  set advisorId(v: number | null) { this._advisorId = v; }

  get programName() { return this._programName; }
  set programName(v: ProgramaHabitacional) { this._programName = v; }

  get currency() { return this._currency; }
  set currency(v: Currency) { this._currency = v; }

  get fullName() { return this._fullName; }
  get dni(): string { return this._dni; }
  set dni(v: string) { this._dni = v; }

  get birthDate(): string { return this._birthDate; }
  set birthDate(v: string) { this._birthDate = v; }

  get email(): string { return this._email; }
  set email(v: string) { this._email = v; }

  get phoneNumber(): string { return this._phoneNumber; }
  set phoneNumber(v: string) { this._phoneNumber = v; }

  get address(): string { return this._address; }
  set address(v: string) { this._address = v; }

  get civilStatus(): CivilStatus { return this._civilStatus; }
  set civilStatus(v: CivilStatus) { this._civilStatus = v; }

  get dependents(): number | null { return this._dependents; }
  set dependents(v: number | null) { this._dependents = v; }

  get jobType(): JobType { return this._jobType; }
  set jobType(v: JobType) { this._jobType = v; }

  get jobMonths(): number | null { return this._jobMonths; }
  set jobMonths(v: number | null) { this._jobMonths = v; }

  get incomeProof(): IncomeProof { return this._incomeProof; }
  set incomeProof(v: IncomeProof) { this._incomeProof = v; }

  get monthlyIncome(): number { return this._monthlyIncome; }
  set monthlyIncome(v: number) { this._monthlyIncome = v; }

  get spouseIncomes(): number { return this._spouseIncomes; }
  set spouseIncomes(v: number) { this._spouseIncomes = v; }

  get totalFamilyIncome(): number { return this._totalFamilyIncome; }
  set totalFamilyIncome(v: number) { this._totalFamilyIncome = v; }

  get hasCurrentDebt(): boolean { return this._hasCurrentDebt; }
  set hasCurrentDebt(v: boolean) { this._hasCurrentDebt = v; }

  get totalMonthlyDebtPayments(): number { return this._totalMonthlyDebtPayments; }
  set totalMonthlyDebtPayments(v: number) { this._totalMonthlyDebtPayments = v; }

  get negativeRecordSbs(): boolean { return this._negativeRecordSbs; }
  set negativeRecordSbs(v: boolean) { this._negativeRecordSbs = v; }

  get hasOtherProperty(): boolean { return this._hasOtherProperty; }
  set hasOtherProperty(v: boolean) { this._hasOtherProperty = v; }

  get receivedBonoBeforeFMV(): boolean { return this._receivedBonoBeforeFMV; }
  set receivedBonoBeforeFMV(v: boolean) { this._receivedBonoBeforeFMV = v; }

  get typeBond(): TypeBond { return this._typeBond; }
  set typeBond(v: TypeBond) { this._typeBond = v; }

  get propertyName(): string { return this._propertyName; }
  set propertyName(v: string) { this._propertyName = v; }

  get propertyLocation(): string { return this._propertyLocation; }
  set propertyLocation(v: string) { this._propertyLocation = v; }

  get propertyDepartment(): string { return this._propertyDepartment; }
  set propertyDepartment(v: string) { this._propertyDepartment = v; }

  get propertyDistrict(): string { return this._propertyDistrict; }
  set propertyDistrict(v: string) { this._propertyDistrict = v; }

  get propertyType(): PropertyType | null { return this._propertyType; }
  set propertyType(v: PropertyType | null) { this._propertyType = v; }

  get propertyPrice(): number { return this._propertyPrice; }
  set propertyPrice(v: number) { this._propertyPrice = v; }

  get isPropertySustainable(): boolean { return this._isPropertySustainable; }
  set isPropertySustainable(v: boolean) { this._isPropertySustainable = v; }

  get hasDownPayment(): boolean { return this._hasDownPayment; }
  set hasDownPayment(v: boolean) { this._hasDownPayment = v; }

  get percentageDownPayment(): number { return this._percentageDownPayment; }
  set percentageDownPayment(v: number) { this._percentageDownPayment = v; }

  get downPaymentAmount(): number { return this._downPaymentAmount; }
  set downPaymentAmount(v: number) { this._downPaymentAmount = v; }

  get financialInstitution(): FinancialInstitution | null { return this._financialInstitution; }
  set financialInstitution(v: FinancialInstitution | null) { this._financialInstitution = v; }

  get deadlinesMonths(): number | null { return this._deadlinesMonths; }
  set deadlinesMonths(v: number | null) { this._deadlinesMonths = v; }

  get typeRate(): string { return this._typeRate; }
  set typeRate(v: string) { this._typeRate = v; }

  get interestRate(): number { return this._interestRate; }
  set interestRate(v: number) { this._interestRate = v; }

  get capitalization(): Capitalization | null { return this._capitalization; }
  set capitalization(v: Capitalization | null) { this._capitalization = v; }

  get monthlyCommissions(): number { return this._monthlyCommissions; }
  set monthlyCommissions(v: number) { this._monthlyCommissions = v; }

  get mortgageInsuranceRate(): number { return this._mortgageInsuranceRate; }
  set mortgageInsuranceRate(v: number) { this._mortgageInsuranceRate = v; }

  get propertyInsurance(): number { return this._propertyInsurance; }
  set propertyInsurance(v: number) { this._propertyInsurance = v; }

  get gracePeriodType(): GracePeriodType { return this._gracePeriodType; }
  set gracePeriodType(v: GracePeriodType) { this._gracePeriodType = v; }

  get gracePeriodMonths(): number { return this._gracePeriodMonths; }
  set gracePeriodMonths(v: number) { this._gracePeriodMonths = v; }

  get dayOfPayment(): string { return this._dayOfPayment; }
  set dayOfPayment(v: string) { this._dayOfPayment = v; }

  get amountBond(): number { return this._amountBond; }
  set amountBond(v: number) { this._amountBond = v; }

  get amountFinanced(): number { return this._amountFinanced; }
  set amountFinanced(v: number) { this._amountFinanced = v; }

  get monthlyFee(): number { return this._monthlyFee; }
  set monthlyFee(v: number) { this._monthlyFee = v; }

  get van(): number | null { return this._van; }
  set van(v: number | null) { this._van = v; }

  get tir(): number | null { return this._tir; }
  set tir(v: number | null) { this._tir = v; }

  get tcea(): number | null { return this._tcea; }
  set tcea(v: number | null) { this._tcea = v; }

  get estado(): EstadoSimulacion { return this._estado; }
  set estado(v: EstadoSimulacion) { this._estado = v; }

  get rejectionReason(): string | null { return this._rejectionReason; }
  set rejectionReason(v: string | null) { this._rejectionReason = v; }

  get simulationDate(): string { return this._simulationDate; }
  set simulationDate(v: string) { this._simulationDate = v; }

  get schedule(): PaymentScheduleEntry[] { return this._schedule; }
  set schedule(v: PaymentScheduleEntry[]) { this._schedule = v; }
}
