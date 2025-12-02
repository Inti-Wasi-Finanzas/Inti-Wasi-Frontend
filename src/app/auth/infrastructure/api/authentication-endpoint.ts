import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/api/base-api-endpoint';
import { User } from '../../domain/model/user.entity';
import { AuthResponse, AuthResource } from '../response/authentication-response';
import { AuthenticationAssembler } from '../assembler/authentication-assembler';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationEndpoint {
  constructor(private http: HttpClient) {}

  signIn(credentials: { username: string; password: string }) {
    const signInUrl = `${environment.serverBaseUrl}${environment.authenticationEndpointPath}/sign-in`;
    return this.http.post(signInUrl, credentials);
  }

  signUp(userData: any) {
    const signUpUrl = `${environment.serverBaseUrl}${environment.authenticationEndpointPath}/sign-up`;
    return this.http.post(signUpUrl, userData);
  }
}
