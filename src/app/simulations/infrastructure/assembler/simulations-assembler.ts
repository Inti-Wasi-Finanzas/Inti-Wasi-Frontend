import {BaseAssembler} from '../../../shared/infrastructure/api/base-assembler';
import {Simulation} from '../../domain/model/simulation.entity';
import {SimulationResource, SimulationsResponse} from './../response/simulations-response';

export class SimulationsAssembler implements BaseAssembler<Simulation, SimulationResource, SimulationsResponse> {

  toEntitiesFromResponse(response: SimulationsResponse | SimulationResource[]): Simulation[] {
    if (Array.isArray(response)) {
      return response.map(r => this.toEntityFromResource(r as SimulationResource));
    }
    return response.simulations.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: SimulationResource): Simulation {
    return new Simulation({
      id: resource.id,
      clientId: resource.clientId,
      advisorId: resource.advisorId ?? null,

      programName: resource.programName,
      currency: resource.currency,

      fullName: resource.fullName,
      dni: resource.dni,
      birthDate: resource.birthDate,
      email: resource.email,
      phoneNumber: resource.phoneNumber,

      civilStatus: resource.civilStatus as any,
      totalFamilyIncome: resource.totalFamilyIncome,
      hasOtherProperty: resource.hasOtherProperty,
      receivedBonoBeforeFMV: resource.receivedBonoBeforeFMV,
      typeBond: resource.typeBond,

      propertyName: resource.propertyName ?? '',
      propertyPrice: resource.propertyPrice,
      isPropertySustainable: resource.isPropertySustainable,

      financialInstitution: resource.financialInstitution,
      deadlinesMonths: resource.deadlinesMonths,
      typeRate: resource.typeRate,
      interestRate: resource.interestRate,
      capitalization: resource.capitalization,

      downPaymentAmount: resource.downPaymentAmount,
      amountBond: resource.amountBond,
      amountFinanced: resource.amountFinanced,
      monthlyFee: resource.monthlyFee,
      van: resource.van,
      tir: resource.tir,
      tcea: resource.tcea,

      estado: resource.estado,
      rejectionReason: resource.rejectionReason,
      simulationDate: resource.simulationDate,
    });
  }

  toResourceFromEntity(entity: Simulation): SimulationResource {
    return {
      id: entity.id,
      clientId: entity.clientId,
      advisorId: entity.advisorId,

      programName: entity.programName,
      currency: entity.currency,

      fullName: entity.fullName,
      dni: entity.dni,
      birthDate: entity.birthDate,
      email: entity.email,
      phoneNumber: entity.phoneNumber,

      civilStatus: entity.civilStatus,
      totalFamilyIncome: entity.totalFamilyIncome,
      hasOtherProperty: entity.hasOtherProperty,
      receivedBonoBeforeFMV: entity.receivedBonoBeforeFMV,
      typeBond: entity.typeBond,

      propertyName: entity.propertyName,
      propertyPrice: entity.propertyPrice,
      isPropertySustainable: entity.isPropertySustainable,

      financialInstitution: entity.financialInstitution,
      deadlinesMonths: entity.deadlinesMonths,
      typeRate: entity.typeRate,
      interestRate: entity.interestRate,
      capitalization: entity.capitalization,

      downPaymentAmount: entity.downPaymentAmount,
      amountBond: entity.amountBond,
      amountFinanced: entity.amountFinanced,
      monthlyFee: entity.monthlyFee,

      van: entity.van,
      tir: entity.tir,
      tcea: entity.tcea,

      estado: entity.estado,
      rejectionReason: entity.rejectionReason,
      simulationDate: entity.simulationDate
    };
  }
}
