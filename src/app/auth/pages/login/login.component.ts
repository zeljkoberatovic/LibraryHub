import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService, LoginCredentials } from '../../services/auth.services';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class Login implements OnInit {
  credentials: LoginCredentials = { email: '', password: '' };
  errorMessage = '';
  isLoading = false;

  // Testni korisnik
  testUsers = [
    { email: 'petar@example.com', password: 'KF.wcn5rdx', name: 'Zeljko Beratovic' }
  ];

 
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // this.authService.testEndpoint();
  }

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Molimo unesite email i lozinku';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        //console.log('Login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        //console.error('Login error:', error);

        if (error.status === 401) {
          this.errorMessage = 'Pogrešni email ili lozinka';
        } else if (error.status === 0) {
          this.errorMessage = 'Problem sa konekcijom. Proverite internet.';
        } else if (error.status === 404) {
          this.errorMessage = 'Endpoint nije pronađen. Proverite API konfiguraciju.';
        } else {
          this.errorMessage = error.error?.message || 'Došlo je do greške. Pokušajte ponovo.';
        }
      }
    });
  }

  quickLogin(userIndex: number) {
    if (userIndex < this.testUsers.length) {
      this.credentials = { 
        email: this.testUsers[userIndex].email,
        password: this.testUsers[userIndex].password
      };
      this.errorMessage = '';
      //console.log('Selected user:', this.testUsers[userIndex].name);
    }
  }
}
