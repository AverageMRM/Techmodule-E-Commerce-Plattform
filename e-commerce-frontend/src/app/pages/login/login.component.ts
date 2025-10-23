import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
