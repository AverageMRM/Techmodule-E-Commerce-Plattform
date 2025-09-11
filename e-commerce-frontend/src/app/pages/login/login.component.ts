import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="auth">
    <h2>Login</h2>
    <form (ngSubmit)="onSubmit()" class="form">
      <label>Email
        <input type="email" [(ngModel)]="email" name="email" required />
      </label>
      <label>Passwort
        <input type="password" [(ngModel)]="password" name="password" required />
      </label>
      <button class="btn" type="submit">Einloggen</button>
    </form>
    <div class="error" *ngIf="error">{{ error }}</div>
  </div>
  `,
  styles: [`
    .auth { max-width: 400px; margin: 40px auto; background:#fff; border:1px solid #eee; border-radius: 12px; padding: 24px; }
    .form { display:flex; flex-direction:column; gap:12px; }
    label { display:flex; flex-direction:column; gap:6px; font-size:14px; color:#374151; }
    input { border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; }
    .btn { background:#0f172a; color:#fff; border:1px solid #1f2937; padding:10px 16px; border-radius:8px; cursor:pointer; }
    .error { color:#dc2626; margin-top: 12px; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  constructor(private auth: AuthService, private router: Router) {}
  onSubmit() {
    this.error = null;
    const ok = this.auth.login(this.email, this.password);
    if (ok) {
      this.router.navigateByUrl('/');
    } else {
      this.error = 'Bitte zuerst registrieren';
    }
  }
}
