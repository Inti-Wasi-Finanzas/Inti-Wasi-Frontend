import { Routes } from '@angular/router';

// Home del cliente
import { DashboardClientComponent } from './presentation/views/dashboard-client/dashboard-client';

// Vistas del cliente
import { ProfileComponent } from './presentation/views/profile/profile';
import { MySimulationsComponent } from './presentation/views/my-simulations/my-simulations';
import { SimulationCreateComponent } from './presentation/views/simulation-create/simulation-create';
import {authGuard, clientGuard} from '../auth/application/guards/auth.guard';

export const CLIENT_ROUTES: Routes = [
  {
    path: 'menu-client',
    component: DashboardClientComponent,
    canActivate: [authGuard, clientGuard],

  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard, clientGuard],
  },
  {
    path: 'my-simulations',
    component: MySimulationsComponent,
    canActivate: [authGuard, clientGuard],
  },
  {
    path: 'simulation-create',
    component: SimulationCreateComponent,
    canActivate: [authGuard, clientGuard],
  },

];
