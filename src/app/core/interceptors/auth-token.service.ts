import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private readonly storageKey = 'auth_token';
  private inMemoryToken: string | null = null;

  get(): string | null {
    if (this.inMemoryToken) {
      return this.inMemoryToken;
    }
    
    const token = localStorage.getItem(this.storageKey);
    if (token) {
      this.inMemoryToken = token;
    }
    return token;
  }

  set(token: string): void {
    this.inMemoryToken = token;
    localStorage.setItem(this.storageKey, token);
  }

  remove(): void {
    this.inMemoryToken = null;
    localStorage.removeItem(this.storageKey);
  }

  
  isValid(): boolean {
    const token = this.get();
    return !!token; // Samo proverava da li token postoji
  }

  
  getUserId(): number | null {
    const token = this.get();
    if (!token) return null;
    
    try {
      // Laravel Sanctum token format: "id|token"
      const parts = token.split('|');
      if (parts.length === 2) {
        return parseInt(parts[0], 10);
      }
      return null;
    } catch {
      return null;
    }
  }

  // Debug metoda
  debugToken(): void {
    const token = this.get();
    console.log('=== TOKEN DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('Token value:', token);
    
    if (token) {
      console.log('User ID from token:', this.getUserId());
    }
  }
}