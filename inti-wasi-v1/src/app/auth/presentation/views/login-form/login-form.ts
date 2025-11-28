import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css'],
  imports: [RouterLink],
})
export class LoginFormComponent {
  // lógica de login luego
}
