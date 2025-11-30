import {BaseResource, BaseResponse} from '../../../shared/infrastructure/api/base-response';
import {
  Capitalization,
  Currency,
  EstadoSimulacion,
  FinancialInstitution,
  ProgramaHabitacional,
  TypeBond
} from '../../domain/model/simulation.entity';

export interface SimulationResource extends BaseResource {
  clientId: number;
  advisorId: number | null;

  programName: ProgramaHabitacional;
  currency: Currency;

  fullName: string;
  dni: string;
  birthDate: string;
  email: string;
  phoneNumber: string;

  civilStatus: string;
  totalFamilyIncome: number;
  hasOtherProperty: boolean;
  receivedBonoBeforeFMV: boolean;
  typeBond: TypeBond;

  propertyName: string | null;
  propertyPrice: number;
  isPropertySustainable: boolean;

  financialInstitution: FinancialInstitution | null;
  deadlinesMonths: number | null;
  typeRate: string;
  interestRate: number;
  capitalization: Capitalization | null;

  downPaymentAmount: number;
  amountBond: number;
  amountFinanced: number;
  monthlyFee: number;
  van: number | null;
  tir: number | null;
  tcea: number | null;

  estado: EstadoSimulacion;
  rejectionReason: string | null;
  simulationDate: string;
}

/**
 * Si algún endpoint devolviera un wrapper, se usaría aquí.
 * En este backend la mayoría devuelve arrays directos, así
 * que este interfaz sirve para compatibilidad con BaseApiEndpoint.
 */
export interface SimulationsResponse extends BaseResponse {
  simulations: SimulationResource[];
}
