import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  templateUrl: './dashboard-client.html',
  styleUrls: ['./dashboard-client.css'],
  imports: [RouterLink, MatIcon],
})
export class DashboardClientComponent {
  // Por ahora no necesitamos lógica, solo la vista
}
