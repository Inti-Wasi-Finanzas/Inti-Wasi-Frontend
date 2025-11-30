import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AuthStore } from '../../../../auth/application/store/auth-store';
import { ClientStore } from '../../../application/store/client-store';
import { Client } from '../../../domain/model/client.entity';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [RouterLink, NgIf, FormsModule, MatIcon],
})
export class ProfileComponent {

  private readonly authStore = inject(AuthStore);
  readonly clientStore = inject(ClientStore);

  // modo edición
  isEditing = false;

  // Modelo usado por el template (ngModel)
  client = {
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    monthlyIncome: 0
  };

  constructor() {
    // Sincroniza el modelo local con el store cuando se cargue el perfil
    effect(() => {
      const c = this.clientStore.client();
      if (c) {
        this.client = {
          fullName: c.fullName,
          dni: c.dni,
          email: c.email,
          phone: c.phone,
          monthlyIncome: c.monthlyIncome
        };
      }
    });
  }

  onEditClick(): void {
    // Si recién entra a edición, solo cambiamos el modo
    if (!this.isEditing) {
      this.isEditing = true;
      return;
    }

    // Guardar cambios
    const current = this.clientStore.client();
    const updated = new Client({
      id: current?.id ?? 0,
      fullName: this.client.fullName,
      dni: this.client.dni,
      email: this.client.email,
      phone: this.client.phone,
      monthlyIncome: Number(this.client.monthlyIncome) || 0
    });

    this.clientStore.updateMyProfile(updated);
    this.isEditing = false;
  }

  logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authStore.logout();
    }
  }
}
