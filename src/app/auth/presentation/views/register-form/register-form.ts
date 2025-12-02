import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthApi } from '../../../infrastructure/api/auth-api';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, MatProgressSpinner, MatIcon],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css']
})


export class RegisterFormComponent {
  private readonly fb = new FormBuilder();

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['CLIENT', Validators.required]
  });

  loading = false;
  error = '';
  success = false;

  constructor(
    private authApi: AuthApi,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = false;

    const { username, password, role } = this.form.getRawValue();
    const roleForBackend = role === 'CLIENT' ? 'ROLE_CLIENT' : 'ROLE_ADVISOR';

    this.authApi.signUp({
      username: username!.trim(),
      password: password!,
      role: roleForBackend,
    }).subscribe({
      next: () => {
        this.success = true;
        console.log('Usuario registrado, redirigiendo al login...');
        // Después de registrar, redirige a la página de login
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 500);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.error = err.error?.message || 'Error al crear cuenta. Usuario puede existir.';
        this.loading = false;
      }
    });
  }
}
