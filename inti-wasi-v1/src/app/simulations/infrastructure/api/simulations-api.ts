import {Injectable} from '@angular/core';
import {BaseApi} from '../../../shared/infrastructure/api/base-api';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {SimulationsApiEndpoint} from './simulations-api-endpoint';
import {PaymentScheduleApiEndpoint} from './payment-schedule-api-endpoint';
import {Simulation} from '../../domain/model/simulation.entity';
import {PaymentScheduleEntry} from '../../domain/model/payment-schedule-entry.entity';
import {SimulationsAssembler} from './../assembler/simulations-assembler';
import {PaymentScheduleAssembler} from './../assembler/payment-schedule-entry-assembler';
import {SimulationResource} from './../response/simulations-response';

@Injectable({
  providedIn: 'root'
})
export class SimulationsApi extends BaseApi {

  private readonly simulationsEndpoint: SimulationsApiEndpoint;
  private readonly scheduleEndpoint: PaymentScheduleApiEndpoint;
  private readonly simulationAssembler = new SimulationsAssembler();
  private readonly scheduleAssembler = new PaymentScheduleAssembler();

  constructor(http: HttpClient) {
    super();
    this.simulationsEndpoint = new SimulationsApiEndpoint(http);
    this.scheduleEndpoint = new PaymentScheduleApiEndpoint(http);
  }

  getSimulation(id: number): Observable<Simulation> {
    return this.simulationsEndpoint.getById(id);
  }

  // createSimulation(simulation: Simulation): Observable<Simulation> {
  //   return this.simulationsEndpoint.create(simulation);
  // }

  // AHORA: usamos el payload tal cual (CreateSimulationResource)
  createSimulation(payload: any): Observable<Simulation> {
    return this.simulationsEndpoint.createRaw(payload).pipe(
      map(res => new Simulation(res))
    );
  }

  updateSimulation(simulation: Simulation): Observable<Simulation> {
    return this.simulationsEndpoint.update(simulation, simulation.id);
  }

  deleteSimulation(id: number): Observable<void> {
    return this.simulationsEndpoint.delete(id);
  }

  getSimulationsByClient(clientId: number): Observable<Simulation[]> {
    return this.simulationsEndpoint.getByClient(clientId).pipe(
      map((resources: SimulationResource[]) =>
        this.simulationAssembler.toEntitiesFromResponse(resources)
      )
    );
  }

  getSchedule(simulationId: number): Observable<PaymentScheduleEntry[]> {
    return this.scheduleEndpoint.getSchedule(simulationId);
  }

  getSchedulePdf(simulationId: number): Observable<Blob> {
    return this.scheduleEndpoint.getSchedulePdf(simulationId);
  }
}
