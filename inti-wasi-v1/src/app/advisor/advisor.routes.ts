import { Routes } from '@angular/router';

import { DashboardAdvisorComponent } from './presentation/views/dashboard-advisor/dashboard-advisor';
import { ClientsListComponent} from './presentation/views/clients-list/clients-list';
import { PendingSimulationsComponent } from './presentation/views/pending-simulations/pending-simulations';

export const ADVISOR_ROUTES: Routes = [
  {
    path: 'menu-advisor',
    component: DashboardAdvisorComponent,
  },
  {
    path: 'clients-list',
    component: ClientsListComponent,
  },
  {
    path: 'pending-simulations',
    component: PendingSimulationsComponent,
  }
];
