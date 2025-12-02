import {BaseResource, BaseResponse} from '../../../shared/infrastructure/api/base-response';

export interface PaymentScheduleEntryResource extends BaseResource {
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
}

export interface PaymentScheduleResponse extends BaseResponse {
  schedule: PaymentScheduleEntryResource[];
}
