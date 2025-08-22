import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private tokenKey = 'authToken';

  set(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  get(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  remove(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isValid(): boolean {
     return !!this.get();
  }
}