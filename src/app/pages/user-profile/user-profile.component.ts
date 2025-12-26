

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibrarianService } from '@/app/services/librarian/librarian.service';
import { AuthService, UserData } from '@/app/auth/services/auth.services';
import { User } from '@/app/models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  user: Partial<User> | null = null;

  constructor(
    private librarianService: LibrarianService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Prvo povuci podatke o korisniku iz AuthService
    this.authService.getCurrentUserData().subscribe({
      next: (data: UserData) => {
        this.user = {
          id: data.id,
          email: data.email,
          first_name: data.name?.split(' ')[0] || '',
          last_name: data.name?.split(' ')[1] || '',
          role_id: data.role === 'bibliotekar' ? 2 : 1,
        };
        // Ako treba više podataka, povuci iz baze
        if (this.user.id) {
          this.librarianService.getLibrarian(this.user.id).subscribe({
            next: (dbUser) => this.user = { ...dbUser, ...this.user },
            error: () => {}
          });
        }
      },
      error: () => this.user = null
    });
  }
}