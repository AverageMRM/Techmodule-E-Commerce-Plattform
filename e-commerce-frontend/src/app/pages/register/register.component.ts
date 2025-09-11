import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

// Google Identity Services global
declare const google: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="auth">
    <h2>Registrieren</h2>
    <form (ngSubmit)="onSubmit()" class="form">
      <label>Email
        <input type="email" [(ngModel)]="email" name="email" required />
      </label>
      <label>Passwort
        <input type="password" [(ngModel)]="password" name="password" required />
      </label>
      <button class="btn" type="submit">Konto erstellen</button>
    </form>
    <div class="or">oder</div>

    <!-- Always render the official Google button container; no fallback prompt -->
    <div id="googleBtn" class="gbtn"></div>
    <div class="hint" *ngIf="!hasGoogle">Google Login ist noch nicht konfiguriert. Bitte Client ID in environment.googleClientId eintragen.</div>
  </div>
  `,
  styles: [`
    .auth { max-width: 400px; margin: 40px auto; background:#fff; border:1px solid #eee; border-radius: 12px; padding: 24px; }
    .form { display:flex; flex-direction:column; gap:12px; }
    label { display:flex; flex-direction:column; gap:6px; font-size:14px; color:#374151; }
    input { border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; }
    .btn { background:#0f172a; color:#fff; border:1px solid #1f2937; padding:10px 16px; border-radius:8px; cursor:pointer; }
    .btn.google { background:#000; color:#fff; border-color:#000; }
    .btn.google:hover { background:#333; }
    .or { text-align:center; color:#6b7280; margin: 12px 0; }
    /* Ensure the GIS button takes full width container nicely */
    #googleBtn { display:flex; justify-content:center; }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  hasGoogle = !!environment.googleClientId;
  private initialized = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Always attempt to initialize GIS; if no client ID, do nothing (no fallback prompt)
    this.waitForGoogleAndInit();
  }

  ngOnDestroy() {
    // No explicit teardown needed for GIS in this simple usage
  }

  onSubmit() {
    this.auth.register(this.email, this.password);
    this.router.navigateByUrl('/');
  }

  private waitForGoogleAndInit(attempt = 0) {
    const maxAttempts = 100; // ~10s
    if (!environment.googleClientId) {
      return; // Not configured, keep button placeholder and hint
    }
    // @ts-ignore
    const g = (window as any).google;
    if (g && g.accounts && g.accounts.id && !this.initialized) {
      try {
        g.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (resp: any) => this.onGoogleCredential(resp?.credential)
        });
        const btn = document.getElementById('googleBtn');
        if (btn) {
          g.accounts.id.renderButton(btn, {
            theme: 'filled_black',
            size: 'large',
            text: 'signup_with',
            shape: 'rectangular',
            width: 320
          });
        }
        this.initialized = true;
      } catch (e) {
        console.error('Google init error', e);
      }
    } else if (attempt < maxAttempts) {
      setTimeout(() => this.waitForGoogleAndInit(attempt + 1), 100);
    }
  }

  private onGoogleCredential(idToken: string | undefined) {
    if (!idToken) { return; }
    const payload = this.decodeJwt(idToken);
    const email = payload?.email as string | undefined;
    if (!email) {
      alert('Google Login fehlgeschlagen: Keine E-Mail erhalten.');
      return;
    }
    this.auth.loginWithGoogle(email);
    this.router.navigateByUrl('/');
  }

  private decodeJwt(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
