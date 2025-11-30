import { Injectable } from '@angular/core';
import { BaseApi } from '../../../shared/infrastructure/api/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../domain/model/client.entity';
import { ClientApiEndpoint } from './client-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class ClientApi extends BaseApi {

  private readonly clientEndpoint: ClientApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.clientEndpoint = new ClientApiEndpoint(http);
  }

  getMyProfile(): Observable<Client> {
    return this.clientEndpoint.getMyProfile();
  }

  updateMyProfile(client: Client): Observable<Client> {
    return this.clientEndpoint.updateMyProfile(client);
  }

  getAllClients(): Observable<Client[]> {
    return this.clientEndpoint.getAllClients();
  }
}
