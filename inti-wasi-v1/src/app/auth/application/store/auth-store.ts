import { Injectable, signal, computed, effect } from '@angular/core';
import { User } from '../../domain/model/user.entity';
import { AuthApi } from '../../infrastructure/api/auth-api';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly isClient = computed(() => this._user()?.isClient ?? false);
  readonly isAdvisor = computed(() => this._user()?.isAdvisor ?? false);
  readonly isAdmin = computed(() => this._user()?.isAdmin ?? false);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private authApi: AuthApi, private router: Router) {
    this.loadUserFromToken();


  }

  login(credentials: { username: string; password: string }) {
    this.loading.set(true);
    this.error.set(null);


    this.authApi.signIn(credentials).subscribe({
      next: (response) => {
        const role = Array.isArray(response.role) ? response.role[0] : response.role;
        const user = new User({
          id: response.id,
          username: response.username,
          role: role
        });

        this._user.set(user);
        this.loading.set(false);

        this.redirectByRole();
      },
      error: (err) => {
        this.error.set('Invalid credentials');
        this.loading.set(false);
      }
    });
  }

  logout() {
    this.authApi.logout();
    this._user.set(null);
    this.router.navigate(['/auth/login']);
  }

  private loadUserFromToken() {
    const token = this.authApi.getToken();
    if (!token) return;

    // 1) Intentar leer el usuario serializado
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const user = new User({
          id: parsed.id,
          username: parsed.username,
          role: parsed.role
        });
        this._user.set(user);
        return;
      } catch (e) {
        console.warn('Error parsing saved user, intentando decodificar token...', e);
      }
    }

    // 2) Fallback: intentar reconstruir desde el token (por si en el futuro cambias backend)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // OJO: aquí ajusta según tu JWT real (scope/authorities/etc.)
      const role =
        payload.role ||
        payload.scope ||
        (Array.isArray(payload.authorities) ? payload.authorities[0] : payload.authorities) ||
        'ROLE_CLIENT';

      const user = new User({
        id: payload.sub || payload.id,
        username: payload.sub || payload.username,
        role: role
      });

      this._user.set(user);

      // De paso, lo guardamos para siguientes recargas:
      localStorage.setItem('auth_user', JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role
      }));
    } catch (e) {
      console.warn('Invalid token, clearing session');
      this.authApi.logout();
    }
  }

  private redirectByRole() {
    // Compara role que ahora es un string
    const target = this._user()?.role === 'ROLE_ADVISOR'
      ? ['/advisor/menu-advisor']
      : this._user()?.role === 'ROLE_CLIENT'
        ? ['/client/menu-client']
        : ['/home'];

    this.router.navigate(target);
  }
}
