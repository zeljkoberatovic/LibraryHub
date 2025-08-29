import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.services';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="userData" class="user-profile">
      <h3>Profil korisnika</h3>
      <p><strong>ID:</strong> {{ userData.id }}</p>
      <p><strong>Ime:</strong> {{ userData.name }}</p>
      <p><strong>Email:</strong> {{ userData.email }}</p>
      <p><strong>Uloga:</strong> {{ userData.role }}</p>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  userData: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUserData().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }
}