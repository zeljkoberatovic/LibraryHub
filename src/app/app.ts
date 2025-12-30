import { Component, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.services';
import { AuthTokenService } from './auth/services/auth-token.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, AsyncPipe, NgIf],
})
export class App {
  isSidebarCollapsed = false;
  private authService = inject(AuthService);
  private authTokenService = inject(AuthTokenService);

  isLoggedIn$: Observable<boolean> = this.authService.authStatus$;

  constructor() {
    // Ako postoji token, a authStatus nije true, postavi ga na true
    if (this.authTokenService.isValid()) {
      // @ts-ignore
      if (this.authService["authStatus"]) {
        // @ts-ignore
        this.authService["authStatus"].next(true);
      }
    }
  }
}
