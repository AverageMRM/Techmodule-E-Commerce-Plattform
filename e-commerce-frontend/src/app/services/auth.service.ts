import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserInfo {
  email: string;
  username?: string;
  provider: 'local' | 'google';
}

interface UserRecord {
  email: string;
  password?: string;
  provider: 'local' | 'google';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'auth_user_v1';
  private usersKey = 'auth_users_v1';
  private _user$ = new BehaviorSubject<UserInfo | null>(this.read());
  readonly user$ = this._user$.asObservable();

  get user(): UserInfo | null { return this._user$.value; }

  // --- persistence helpers ---
  private read(): UserInfo | null {
    const raw = localStorage.getItem(this.storageKey);
    try { return raw ? JSON.parse(raw) as UserInfo : null; } catch { return null; }
  }

  private write(user: UserInfo | null) {
    if (user) localStorage.setItem(this.storageKey, JSON.stringify(user));
    else localStorage.removeItem(this.storageKey);
    this._user$.next(user);
  }

  private getUsers(): UserRecord[] {
    const raw = localStorage.getItem(this.usersKey);
    try { return raw ? JSON.parse(raw) as UserRecord[] : []; } catch { return []; }
  }

  private setUsers(users: UserRecord[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // --- public API ---
  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const rec = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!rec) {
      return false; // not registered
    }
    if (rec.provider === 'local' && rec.password !== password) {
      return false; // wrong password (simple check)
    }
    this.write({ email: rec.email, provider: rec.provider });
    return true;
  }

  register(email: string, password: string): boolean {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    const rec: UserRecord = { email, password, provider: 'local' };
    if (idx >= 0) users[idx] = rec; else users.push(rec);
    this.setUsers(users);
    this.write({ email, provider: 'local' });
    return true;
  }

  loginWithGoogle(email: string): boolean {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    const rec: UserRecord = { email, provider: 'google' };
    if (idx >= 0) users[idx] = { ...users[idx], provider: 'google' }; else users.push(rec);
    this.setUsers(users);
    this.write({ email, provider: 'google' });
    return true;
  }

  logout() { this.write(null); }
}
