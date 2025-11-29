import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import {AuthStore} from '../../../../auth/application/store/auth-store';

/**
 * Modelo del formulario de simulación, alineado con tu backend
 */
interface NewSimulationForm {
  programName: string | null;
  fullName: string | null;
  dni: string | null;
  birthDate: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  civilStatus: string | null;
  dependents: number | null;
  jobType: string | null;
  jobMonths: number | null;
  incomeProof: string | null;
  monthlyIncome: number | null;
  spouseIncomes: number | null;
  hasCurrentDebt: boolean | null;
  totalMonthlyDebtPayments: number | null;
  negativeRecordSbs: boolean | null;
  hasOtherProperty: boolean | null;
  receivedBonoBeforeFMV: boolean | null;
  typeBond: string | null;
  propertyName: string | null;
  propertyLocation: string | null;
  propertyDepartment: string | null;
  propertyDistrict: string | null;
  propertyType: string | null;
  propertyPrice: number | null;
  isPropertySustainable: boolean | null;
  hasDownPayment: boolean | null;
  percentageDownPayment: number | null;
  financialInstitution: string | null;
  deadlinesMonths: number | null;
  typeRate: string | null; // TEA / TNA
  interestRate: number | null; // en %
  capitalization: string | null; // MENSUAL, etc.
  monthlyCommissions: number | null;
  mortgageInsuranceRate: number | null; // tasa decimal (0.0003)
  propertyInsurance: number | null;
  gracePeriodType: string | null;
  gracePeriodMonths: number | null;
  dayOfPayment: string | null;
}

/**
 * Datos que se muestran en el resumen
 */
interface SimulationSummary {
  montoInmueble?: number | null;
  cuotaInicial?: number | null;
  bono?: number | null;
  montoFinanciar?: number | null;
  cuotaMensual?: number | null;
  tcea?: number | null;
  van?: number | null;
  tir?: number | null;
}

@Component({
  selector: 'app-simulation-create',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIcon],
  templateUrl: './simulation-create.html',
  styleUrl: './simulation-create.css',
})
export class SimulationCreateComponent {

  constructor(private authStore: AuthStore) {}

  // FORMULARIO INICIAL (VACÍO)
  simulation: NewSimulationForm = {
    programName: null,
    fullName: null,
    dni: null,
    birthDate: null,
    email: null,
    phoneNumber: null,
    address: null,
    civilStatus: null,
    dependents: null,
    jobType: null,
    jobMonths: null,
    incomeProof: null,
    monthlyIncome: null,
    spouseIncomes: null,
    hasCurrentDebt: null,
    totalMonthlyDebtPayments: null,
    negativeRecordSbs: null,
    hasOtherProperty: null,
    receivedBonoBeforeFMV: null,
    typeBond: null,
    propertyName: null,
    propertyLocation: null,
    propertyDepartment: null,
    propertyDistrict: null,
    propertyType: null,
    propertyPrice: null,
    isPropertySustainable: null,
    hasDownPayment: null,
    percentageDownPayment: null,
    financialInstitution: null,
    deadlinesMonths: null,
    typeRate: null,
    interestRate: null,
    capitalization: null,
    monthlyCommissions: null,
    mortgageInsuranceRate: null,
    propertyInsurance: null,
    gracePeriodType: null,
    gracePeriodMonths: null,
    dayOfPayment: null,
  };

  // RESUMEN (se llena al simular)

  summary: SimulationSummary = {};

  // Click en Simular

  onSimulate(): void {
    const price = this.simulation.propertyPrice ?? 0;
    if (!price || price <= 0) {
      // Si no hay precio, limpiamos resumen y salimos
      this.summary = {};
      return;
    }

    const downPct = this.simulation.percentageDownPayment ?? 0;
    const downPayment = price * (downPct / 100);

    const bono = this.calculateBond(price);

    const montoFinanciarRaw = price - downPayment - bono;
    const montoFinanciar = Math.max(montoFinanciarRaw, 0);

    const nMonths = this.simulation.deadlinesMonths ?? 0;
    const iNominal = (this.simulation.interestRate ?? 0) / 100; // % a decimal
    const typeRate = this.simulation.typeRate ?? 'TEA';

    const iMensual = this.toMonthlyRate(iNominal, typeRate);

    const cuotaBase = this.calculateFrenchInstallment(
      montoFinanciar,
      iMensual,
      nMonths
    );

    const extraCommissions = this.simulation.monthlyCommissions ?? 0;
    const seguroInmueble = this.simulation.propertyInsurance ?? 0;
    const tasaSeguroDesgravamen = this.simulation.mortgageInsuranceRate ?? 0;
    const seguroDesgravamen = montoFinanciar * tasaSeguroDesgravamen;

    const cuotaMensual =
      cuotaBase + extraCommissions + seguroInmueble + seguroDesgravamen;

    // TCEA aproximada (bien simple, pero funcional)
    const tcea = this.estimateTCEA(montoFinanciar, cuotaMensual, nMonths);

    this.summary = {
      montoInmueble: this.round(price),
      cuotaInicial: this.round(downPayment),
      bono: this.round(bono),
      montoFinanciar: this.round(montoFinanciar),
      cuotaMensual: this.round(cuotaMensual),
      tcea: tcea ? this.round(tcea * 100) : null, // la guardamos en %
      van: null, // por ahora sin cálculo
      tir: null, // por ahora sin cálculo
    };
  }

  // Lógica del negocio auxiliar

  /**
   * Cálculo del bono aplicable.
   * Ajusta aquí las reglas reales de MiVivienda si las tienes.
   */
  private calculateBond(propertyPrice: number): number {
    if (!this.simulation.typeBond) {
      return 0;
    }

    const isSustainable = this.simulation.isPropertySustainable === true;

    if (this.simulation.typeBond === 'BBP_SOSTENIBLE' && isSustainable) {
      // Ejemplo: bono mayor si es sostenible
      return 40000;
    }

    if (this.simulation.typeBond === 'BBP_TRADICIONAL') {
      return 30000;
    }

    return 0;
  }

  /**
   * Convierte TEA/TNA a tasa efectiva mensual.
   */
  private toMonthlyRate(iNominal: number, typeRate: string): number {
    if (!iNominal || iNominal <= 0) {
      return 0;
    }

    if (typeRate === 'TEA') {
      // TEA → tasa efectiva mensual
      return Math.pow(1 + iNominal, 1 / 12) - 1;
    }

    // TNA u otros → asumimos dividido entre 12
    return iNominal / 12;
  }

  /**
   * Cuota del sistema francés.
   */
  private calculateFrenchInstallment(
    principal: number,
    iMonthly: number,
    nMonths: number
  ): number {
    if (!principal || principal <= 0 || !iMonthly || iMonthly <= 0 || !nMonths || nMonths <= 0) {
      return 0;
    }

    const factor = Math.pow(1 + iMonthly, nMonths);
    const cuota = principal * ((iMonthly * factor) / (factor - 1));
    return cuota;
  }

  /**
   * Estimación simple de TCEA a partir de cuota mensual.
   * NO es una TCEA financiera perfecta, pero es funcional.
   */
  private estimateTCEA(
    principal: number,
    cuotaMensual: number,
    nMonths: number
  ): number | null {
    if (!principal || principal <= 0 || !cuotaMensual || cuotaMensual <= 0 || !nMonths || nMonths <= 0) {
      return null;
    }

    // Aproximación grosera: (Total pagado / principal)^(12/n) - 1
    const totalPagado = cuotaMensual * nMonths;
    const ratio = totalPagado / principal;

    if (ratio <= 0) {
      return null;
    }

    const tceaAprox = Math.pow(ratio, 12 / nMonths) - 1;
    return tceaAprox;
  }

  /**
   * Redondeo a 2 decimales.
   */
  private round(value: number | null | undefined): number | null {
    if (value === null || value === undefined || isNaN(value)) {
      return null;
    }
    return Math.round(value * 100) / 100;
  }

  logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
