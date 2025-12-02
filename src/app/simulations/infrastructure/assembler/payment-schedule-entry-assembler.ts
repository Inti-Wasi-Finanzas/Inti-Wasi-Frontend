import {PaymentScheduleEntry} from '../../domain/model/payment-schedule-entry.entity';
import {PaymentScheduleEntryResource, PaymentScheduleResponse} from './../response/payment-schedule-entry-response';

export class PaymentScheduleAssembler  {

  toEntitiesFromResponse(response: PaymentScheduleResponse | PaymentScheduleEntryResource[]): PaymentScheduleEntry[] {
    if (Array.isArray(response)) {
      return response.map(r => this.toEntityFromResource(r as PaymentScheduleEntryResource));
    }
    return response.schedule.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: PaymentScheduleEntryResource): PaymentScheduleEntry {
    return new PaymentScheduleEntry({
      installmentNumber: resource.installmentNumber,
      dueDate: resource['dueDate'],
      teaAnnual: resource.teaAnnual,
      tepPeriod: resource.tepPeriod,
      beginningBalance: resource.beginningBalance,
      interest: resource.interest,
      installmentWithSegDes: resource.installmentWithSegDes,
      amortization: resource.amortization,
      seguroDesgravamen: resource.seguroDesgravamen,
      seguroRiesgo: resource.seguroRiesgo,
      comision: resource.comision,
      endingBalance: resource.endingBalance,
      flujo: resource.flujo
    });
  }

  toResourceFromEntity(entity: PaymentScheduleEntry): PaymentScheduleEntryResource {
    return {
      id: entity.installmentNumber,
      installmentNumber: entity.installmentNumber,
      dueDate: entity.dueDate,
      teaAnnual: entity.teaAnnual,
      tepPeriod: entity.tepPeriod,
      beginningBalance: entity.beginningBalance,
      interest: entity.interest,
      installmentWithSegDes: entity.installmentWithSegDes,
      amortization: entity.amortization,
      seguroDesgravamen: entity.seguroDesgravamen,
      seguroRiesgo: entity.seguroRiesgo,
      comision: entity.comision,
      endingBalance: entity.endingBalance,
      flujo: entity.flujo
    } as PaymentScheduleEntryResource;
  }
}
