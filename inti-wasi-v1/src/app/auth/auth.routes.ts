import { Routes } from '@angular/router';
import { LoginFormComponent } from './presentation/views/login-form/login-form';
import { RegisterFormComponent } from './presentation/views/register-form/register-form';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
];
