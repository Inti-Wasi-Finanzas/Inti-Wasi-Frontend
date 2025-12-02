import { Routes } from '@angular/router';
import { authGuard, clientGuard, advisorGuard } from './auth/application/guards/auth.guard';


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
    canActivate: [authGuard, clientGuard],
    loadChildren: () =>
      import('./client/client.routes').then((m) => m.CLIENT_ROUTES),
  },
  {
    path: 'advisor',
    canActivate: [authGuard, advisorGuard],
    loadChildren: () =>
      import('./advisor/advisor.routes').then((m) => m.ADVISOR_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
