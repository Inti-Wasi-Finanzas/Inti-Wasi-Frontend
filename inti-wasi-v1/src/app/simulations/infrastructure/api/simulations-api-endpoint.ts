import {BaseApiEndpoint} from '../../../shared/infrastructure/api/base-api-endpoint';
import {Simulation} from '../../domain/model/simulation.entity';
import {SimulationsAssembler} from './../assembler/simulations-assembler';
import {SimulationResource, SimulationsResponse} from './../response/simulations-response';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs';

export class SimulationsApiEndpoint
  extends BaseApiEndpoint<Simulation, SimulationResource, SimulationsResponse, SimulationsAssembler> {

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBaseUrl}${environment.simulationsEndpointPath}`,
      new SimulationsAssembler()
    );
  }

  /**
   * GET /api/v1/simulations/client/{clientId}
   */
  getByClient(clientId: number) {
    const url = `${this.endpointUrl}/client/${clientId}`;
    return this.http.get<SimulationResource[]>(url);
  }

  /**
   * POST /api/v1/simulations
   * Usa directamente el payload del formulario (CreateSimulationResource)
   * y mapea la respuesta a la entidad Simulation.
   */
  createRaw(payload: any) {
    return this.http
      .post<SimulationResource>(this.endpointUrl, payload)
      .pipe(map(res => this.assembler.toEntityFromResource(res)));
  }

}
