import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Client } from '../../domain/model/client.entity';
import { ClientAssembler } from '../assembler/client-assembler';
import { ClientResource, ClientsResponse } from '../response/client-response';

export class ClientApiEndpoint {

  private readonly baseUrl = `${environment.serverBaseUrl}${environment.clientsEndpointPath}`;
  private readonly assembler = new ClientAssembler();

  constructor(private http: HttpClient) {}

  /**
   * GET /clients/profile
   */
  getMyProfile(): Observable<Client> {
    return this.http.get<ClientResource>(`${this.baseUrl}/profile`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  /**
   * PUT /clients/profile
   * Usa el formato de UpdateClientResource (sin id, el backend infiere por el userId del token).
   */
  updateMyProfile(client: Client): Observable<Client> {
    const payload = {
      fullName: client.fullName,
      dni: client.dni,
      email: client.email,
      phone: client.phone,
      monthlyIncome: client.monthlyIncome
    };

    return this.http.put<ClientResource>(`${this.baseUrl}/profile`, payload).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  /**
   * GET /clients/allProfiles (pensando en el asesor, por si lo necesitas luego).
   */
  getAllClients(): Observable<Client[]> {
    return this.http.get<ClientsResponse | ClientResource[]>(`${this.baseUrl}/allProfiles`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(r => this.assembler.toEntityFromResource(r as ClientResource));
        }
        return this.assembler.toEntitiesFromResponse(response as ClientsResponse);
      })
    );
  }
}
