import { Component, inject, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
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
export class ProfileComponent implements OnInit{

  private readonly authStore = inject(AuthStore);
  readonly clientStore = inject(ClientStore);
  private readonly router = inject(Router);

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

  ngOnInit(): void {
    // Seguridad extra: esta página es SOLO para CLIENT.
    if (!this.authStore.isClient()) {
      // Si por algún motivo llega alguien sin rol CLIENT aquí,
      // lo sacamos (por ejemplo al home o login).
      this.router.navigate(['/home']);
      return;
    }

    // Cargar (o intentar cargar) el perfil del cliente.
    this.clientStore.loadMyProfile();
  }

  onEditClick(): void {
    const current = this.clientStore.client();

    // 1) ENTRAR A MODO EDICIÓN
    if (!this.isEditing) {
      if (current) {
        // Hay perfil en BD → rellenamos con datos actuales
        this.editModel = {
          fullName: current.fullName,
          dni: current.dni,
          email: current.email,
          phone: current.phone,
          monthlyIncome: current.monthlyIncome
        };
      } else {
        // No hay perfil aún → modelo vacío (lo creará el backend en el PUT)
        this.editModel = {
          fullName: '',
          dni: '',
          email: '',
          phone: '',
          monthlyIncome: 0
        };
      }

      this.isEditing = true;
      return;
    }

    // 2) GUARDAR CAMBIOS (crear/actualizar perfil)
    const updated = new Client({
      id: current?.id ?? 0, // el backend ignora esto y usa el userId del token
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
