import { Injectable, computed, signal } from '@angular/core';
import { LoginRequest } from '../models/auth.model';

const TOKEN_KEY = 'ac_token';

//el provider lo tenemos en root porque queremos que el servicio sea singleTon
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  //computed porque queremos que se actualice cada vez que cambie el token
  //la doble exclamación es para convertir el token en un booleano, si el token es null o undefined será false y si tiene un valor será true
  isAuthenticated = computed(() => !!this._token());

  login(credentials: LoginRequest): void {
    const token = btoa(`${credentials.email}:${credentials.pnr}`);
    this._token.set(token);
    localStorage.setItem(TOKEN_KEY, token);
  }

  logout(): void {
    this._token.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return this._token();
  }
}
