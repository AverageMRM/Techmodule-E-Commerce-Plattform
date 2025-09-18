import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  standalone: true,
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('e-commerce-frontend');
  constructor(public auth: AuthService) {}
  logout() { this.auth.logout(); }
}
