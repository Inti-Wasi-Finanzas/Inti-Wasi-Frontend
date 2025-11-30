export class PaymentScheduleEntry {
  private _installmentNumber: number;
  private _dueDate: string;
  private _teaAnnual: number;
  private _tepPeriod: number;
  private _beginningBalance: number;
  private _interest: number;
  private _installmentWithSegDes: number;
  private _amortization: number;
  private _seguroDesgravamen: number;
  private _seguroRiesgo: number;
  private _comision: number;
  private _endingBalance: number;
  private _flujo: number;

  constructor(e: {
    installmentNumber: number;
    dueDate: string;
    teaAnnual: number;
    tepPeriod: number;
    beginningBalance: number;
    interest: number;
    installmentWithSegDes: number;
    amortization: number;
    seguroDesgravamen: number;
    seguroRiesgo: number;
    comision: number;
    endingBalance: number;
    flujo: number;
  }) {
    this._installmentNumber = e.installmentNumber;
    this._dueDate = e.dueDate;
    this._teaAnnual = e.teaAnnual;
    this._tepPeriod = e.tepPeriod;
    this._beginningBalance = e.beginningBalance;
    this._interest = e.interest;
    this._installmentWithSegDes = e.installmentWithSegDes;
    this._amortization = e.amortization;
    this._seguroDesgravamen = e.seguroDesgravamen;
    this._seguroRiesgo = e.seguroRiesgo;
    this._comision = e.comision;
    this._endingBalance = e.endingBalance;
    this._flujo = e.flujo;
  }

  get installmentNumber(): number { return this._installmentNumber; }
  get dueDate(): string { return this._dueDate; }
  get teaAnnual(): number { return this._teaAnnual; }
  get tepPeriod(): number { return this._tepPeriod; }
  get beginningBalance(): number { return this._beginningBalance; }
  get interest(): number { return this._interest; }
  get installmentWithSegDes(): number { return this._installmentWithSegDes; }
  get amortization(): number { return this._amortization; }
  get seguroDesgravamen(): number { return this._seguroDesgravamen; }
  get seguroRiesgo(): number { return this._seguroRiesgo; }
  get comision(): number { return this._comision; }
  get endingBalance(): number { return this._endingBalance; }
  get flujo(): number { return this._flujo; }
}
