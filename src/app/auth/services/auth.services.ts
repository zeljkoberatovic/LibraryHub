import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, finalize, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthTokenService } from './auth-token.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://cortex-api.fabrika.me';
  private http = inject(HttpClient);
  private authTokenService = inject(AuthTokenService);
  private router = inject(Router);

  // BehaviorSubject za praćenje statusa prijave
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();

  /** Prijava korisnika sa obradom grešaka */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.authTokenService.set(response.token);
          this.authStatus.next(true); // Obavještava sve pretplatnike da je korisnik prijavljen
        }
      }),
      catchError(error => {
        return throwError(() => error); 
      })
    );
  }

  /** Debug metoda samo za razvoj (development) */
  testEndpoint(): void {
    console.log('Provjera konfiguracije endpoint-a:');
    console.log('API URL:', this.apiUrl);
    console.log('Login endpoint:', `${this.apiUrl}/api/login`);
    const testData = { email: 'marko@example.com', password: 'brp1kju.kjt' };
    console.log('Testni podaci:', testData);
  }

  /** Dohvata podatke trenutnog korisnika sa servera */
  getCurrentUserData(): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/user`);
  }

  /** Odjava korisnika sa finalizacijom */
  logout(): Observable<void> {
    const token = this.authTokenService.get();

    return this.http.post<void>(`${this.apiUrl}/api/logout`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).pipe(
      finalize(() => {
        this.authTokenService.remove(); // Uklanja token iz lokalnog skladišta
        this.authStatus.next(false);    // Obavještava sve pretplatnike da je korisnik odjavljen
        this.router.navigate(['/login']); 
      })
    );
  }

  /** Provjerava da li je korisnik trenutno prijavljen */
  isLoggedIn(): boolean {
    return this.authTokenService.isValid();
  }

  /** Dohvata JWT payload trenutnog korisnika */
  getCurrentUser() {
    const token = this.authTokenService.get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
}
