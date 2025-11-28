// src/app/client/presentation/views/profile/profile.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [RouterLink, NgIf, FormsModule, MatIcon],
})
export class ProfileComponent {
  // modo edición
  isEditing = false;

  // objeto que luego vas a rellenar con tu backend
  client = {
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    income: '',
  };

  onEditClick(): void {
    // si estaba en edición, aquí podrías llamar a tu servicio para guardar
    this.isEditing = !this.isEditing;
  }
}

