
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.name.trim()) {
      this.errorMessage = 'Ime i prezime je obavezno.';
      return;
    }
    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Unesite validan email.';
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage = 'Lozinka mora imati najmanje 8 karaktera.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Lozinke se ne poklapaju.';
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Registracija uspješna!';
      this.name = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
    }, 1800);
  }
}
