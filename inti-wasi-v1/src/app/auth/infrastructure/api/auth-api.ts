import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../../shared/infrastructure/api/base-api';
import { AuthenticationEndpoint } from './authentication-endpoint';
import { User } from  '../../domain/model/user.entity';
import { Observable, map, tap } from 'rxjs';
import {environment} from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private http: HttpClient) {}

  signIn(credentials: { username: string; password: string }): Observable<User> {
    const loginUrl = `${environment.serverBaseUrl}${environment.authenticationEndpointPath}/sign-in`;
    return this.http.post<any>(loginUrl, credentials).pipe(
      map((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('access_token', token); // Guardamos el token
        }

        // Asegúrate de que el backend devuelve un solo role como string
        const role = response.role || 'ROLE_CLIENT'; // Valor por defecto

        const user = new User({
          id: response.id,
          username: response.username,
          role: role // Usamos un único valor para role
        });

        // Guardamos también el usuario serializado:
        localStorage.setItem('auth_user', JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role
        }));

        return user;
      })
    );
  }

  signUp(data: { username: string; password: string; role?: string }): Observable<User> {
    const payload = {
      username: data.username,
      password: data.password,
      role: data.role || 'ROLE_CLIENT' // Usamos un solo valor para role
    };

    const signUpUrl = `${environment.serverBaseUrl}${environment.authenticationEndpointPath}/sign-up`;
    return this.http.post<any>(signUpUrl, payload).pipe(
      map((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('access_token', token);
        }

        const role = response.role || 'ROLE_CLIENT'; // Valor por defecto

        const user = new User({
          id: response.id,
          username: response.username,
          role: role
        });

        localStorage.setItem('auth_user', JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role
        }));

        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
