import { Routes } from '@angular/router';

// Home del cliente
import { DashboardClientComponent } from './presentation/views/dashboard-client/dashboard-client';

// Vistas del cliente
import { ProfileComponent } from './presentation/views/profile/profile';
import { MySimulationsComponent } from './presentation/views/my-simulations/my-simulations';
import { SimulationCreateComponent } from './presentation/views/simulation-create/simulation-create';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: DashboardClientComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'my-simulations',
    component: MySimulationsComponent,
  },
  {
    path: 'simulation-create',
    component: SimulationCreateComponent,
  },

];
