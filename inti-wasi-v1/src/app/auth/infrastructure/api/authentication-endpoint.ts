import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/api/base-api-endpoint';
import { User } from '../../domain/model/user.entity';
import { AuthResponse, AuthResource } from '../response/authentication-response';
import { AuthenticationAssembler } from '../assembler/authentication-assembler';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationApiEndpoint extends BaseApiEndpoint<User, AuthResource, AuthResponse, AuthenticationAssembler> {

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.serverBaseUrl}${environment.authenticationEndpointPath}`,
      new AuthenticationAssembler()
    );
  }
  signIn(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.endpointUrl}/sign-in`, credentials);
  }

  signUp(userData: any): Observable<any> {
    return this.http.post<any>(`${this.endpointUrl}/sign-up`, userData);
  }
}
