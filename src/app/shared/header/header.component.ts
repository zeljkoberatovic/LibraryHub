import { Component, OnInit, OnDestroy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AuthService } from '@/app/auth/services/auth.services';
import { Subscription } from 'rxjs';
import { User } from '@/app/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  user: User | null = null;
  private authSubscription!: Subscription;
  plusMenuOpen = false;
  userMenuOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Pratite promjene u autentikaciji
    this.authSubscription = this.authService.authStatus$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.user = this.authService.getCurrentUser();
      } else {
        this.user = null;
      }
    });

    // Inicijalno postavite status
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.user = this.authService.getCurrentUser();
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (err) => {
        console.error('Logout error:', err);
      }
    });
  }

  togglePlusMenu() {
    this.plusMenuOpen = !this.plusMenuOpen;
  }

  closePlusMenu() {
    this.plusMenuOpen = false;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }
}