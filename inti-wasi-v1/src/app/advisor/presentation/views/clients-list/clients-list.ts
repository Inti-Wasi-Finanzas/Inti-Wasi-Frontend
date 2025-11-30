import {Component, effect, inject} from '@angular/core';
import {DecimalPipe, NgFor, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {AuthStore} from '../../../../auth/application/store/auth-store';
//import { Client } from '../../../client/domain/model/client.entity';
import {Client} from '../../../../client/domain/model/client.entity';
import {ClientStore} from '../../../../client/application/store/client-store';


@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [RouterLink, NgFor, DecimalPipe, MatIcon],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css',
})
export class ClientsListComponent {
  private readonly authStore = inject(AuthStore);
  readonly clientsStore = inject(ClientStore);

  clients: Client[] = [];

  constructor(private router: Router) {
    // sincroniza el array local con el store
    effect(() => {
      this.clients = this.clientsStore.clients();
    });
  }

  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
