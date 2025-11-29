import { Injectable, signal, computed, effect } from '@angular/core';
import { User } from '../../domain/model/user.entity';
import { AuthApi } from  '../../infrastructure/api/auth-api';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<User | null>(null);

  // Signals públicos
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly isClient = computed(() => this._user()?.isClient ?? false);
  readonly isAdvisor = computed(() => this._user()?.isAdvisor ?? false); // ROLES: ROLE_ADVISOR
  readonly isAdmin = computed(() => this._user()?.isAdmin ?? false);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private authApi: AuthApi,
    private router: Router
  ) {
    this.loadUserFromToken();

    // REDIRECCIÓN AUTOMÁTICA CUANDO SE LOGUEA
    effect(() => {
      if (this.isAuthenticated()) {
        console.log('AuthStore detectó login → redirigiendo...');
        this.redirectByRole();
      }
    });
  }

  login(credentials: { username: string; password: string }) {
    this.loading.set(true);
    this.error.set(null);

    this.authApi.signIn(credentials).subscribe({
      next: (user) => {
        console.log('Login exitoso -> guardando usuario en store');
        this._user.set(user);           // ← IMPORTANTE: aquí se actualiza
        this.loading.set(false);
        //navegacion segura inmediatamente despues de setear el usuario
        this.redirectByRole();
      },
      error: (err) => {
        console.error('Error login:', err);
        this.error.set('Usuario o contraseña incorrectos');
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

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = new User({
        id: payload.sub || payload.id,
        username: payload.sub || payload.username,
        roles: (payload.scope || payload.authorities || 'ROLE_CLIENT').split(' ').filter(Boolean)
      });
      this._user.set(user);
    } catch (e) {
      console.warn('Token inválido al cargar');
      this.authApi.logout();
    }
  }

  private redirectByRole() {
    const target = this.isClient()
      ? ['/client/menu-client']
      : this.isAdvisor()
        ? ['/advisor/menu-advisor']
        : this.isAdmin()
          ? ['/admin/users']
          : ['/home'];

    // Ejecutar la navegación en la siguiente microtarea para evitar problemas de timing en apps zoneless
    Promise.resolve().then(() => this.router.navigate(target));
  }
}

