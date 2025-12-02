import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule, DecimalPipe, NgFor, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {AuthStore} from '../../../../auth/application/store/auth-store';
//import { Client } from '../../../client/domain/model/client.entity';
import {Client} from '../../../../client/domain/model/client.entity';
import {ClientStore} from '../../../../client/application/store/client-store';


@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIcon],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css',
})
export class ClientsListComponent implements OnInit{

  private readonly authStore = inject(AuthStore);
  readonly clientStore = inject(ClientStore);

  ngOnInit(): void {
    this.clientStore.loadAllClients();  // 👈 lo vemos en el punto 2
  }

  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
