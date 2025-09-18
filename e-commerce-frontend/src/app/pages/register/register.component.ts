import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email = '';
  password = '';
  hasGoogle = !!environment.googleClientId;
  private initialized = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Always attempt to initialize GIS; if no client ID, do nothing (no fallback prompt)
    this.waitForGoogleAndInit();
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
