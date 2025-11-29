import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {AuthStore} from '../../../application/store/auth-store';
import {CommonModule} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css'],
  imports: [RouterLink, ReactiveFormsModule, MatProgressSpinner, CommonModule],
})
export class LoginFormComponent {
  private readonly fb = new FormBuilder();

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(public store: AuthStore  ) {}

  onSubmit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.getRawValue();

    this.store.login({
      username: username!.trim(), //esto es para evitar espacios al inicio o final
      password: password!
    });
  }
}
