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

  // modelo solo para editar
  editModel = {
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    monthlyIncome: 0
  };


  onEditClick(): void {
    const current = this.clientStore.client();
    if (!this.isEditing) {
      // Entrando a edición: copiamos datos actuales al modelo
      if (!current) return; // aún no se cargó el perfil
      this.editModel = {
        fullName: current.fullName,
        dni: current.dni,
        email: current.email,
        phone: current.phone,
        monthlyIncome: current.monthlyIncome
      };
      this.isEditing = true;
      return;
    }

    // Guardar cambios
    if (!current) return;
    const updated = new Client({
      id: current.id,
      fullName: this.editModel.fullName,
      dni: this.editModel.dni,
      email: this.editModel.email,
      phone: this.editModel.phone,
      monthlyIncome: Number(this.editModel.monthlyIncome) || 0
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
