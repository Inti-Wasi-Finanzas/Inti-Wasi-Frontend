import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../../shared/infrastructure/api/base-api';
import { AuthenticationApiEndpoint } from './authentication-endpoint';
import { User } from  '../../domain/model/user.entity';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApi extends BaseApi {
  private readonly authEndpoint: AuthenticationApiEndpoint;

  constructor(private http: HttpClient) {
    super();
    this.authEndpoint = new AuthenticationApiEndpoint(http);
  }

  signIn(credentials: { username: string; password: string }): Observable<User> {
    return this.authEndpoint.signIn(credentials).pipe(
      // Primero recibimos la respuesta completa (con token)
      map((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('access_token', token);
        }

        // Extraemos los roles del token
        const roles = this.extractRolesFromToken(token);

        return new User({
          id: response.id,
          username: response.username,
          roles: roles
        });
      })
    );
  }

  signUp(data: { username: string; password: string; role?: string }): Observable<User> {
    const payload = {
      username: data.username,
      password: data.password,
      // Si tu backend espera "roles" como array:
      roles: data.role ? [data.role] : ['ROLE_CLIENT'] // Valor por defecto
      // O si espera solo "role": { role: data.role || 'ROLE_CLIENT' }
    };

    return this.authEndpoint.signUp(payload).pipe(
      map((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('access_token', token);
        }

        const roles = this.extractRolesFromToken(token);

        return new User({
          id: response.id,
          username: response.username,
          roles: roles
        });

      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private extractRolesFromToken(token: string): string[] {
    if (!token) return ['ROLE_CLIENT']; // Valor por defecto si no hay token

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const scope = payload.scope || payload.authorities || '';
      return scope.split(' ').filter(Boolean);
    } catch (e) {
      console.warn('Token inválido o corrupto', e);
      return ['ROLE_CLIENT'];
    }
  }
}
