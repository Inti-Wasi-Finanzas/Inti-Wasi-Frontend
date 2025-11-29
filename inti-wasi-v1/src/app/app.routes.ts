import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'client',
    loadChildren: () =>
      import('./client/client.routes').then((m) => m.CLIENT_ROUTES),
  },
  {
    path: 'advisor',
    loadChildren: () =>
      import('./advisor/advisor.routes').then((m) => m.ADVISOR_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
