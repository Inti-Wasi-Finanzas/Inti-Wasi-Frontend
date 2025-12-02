import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../store/auth-store';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // isAuthenticated es un computed signal, se llama como función
  if (authStore.isAuthenticated()) {
    return true;
  }

  // Si no está logueado, enviamos al login
  return router.parseUrl('/auth/login');
};

export const clientGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isClient()) {
    return true;
  }

  // si no es cliente, lo mandamos a donde corresponda
  return router.parseUrl('/auth/login');
};

export const advisorGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAdvisor()) {
    return true;
  }

  return router.parseUrl('/auth/login');
};
