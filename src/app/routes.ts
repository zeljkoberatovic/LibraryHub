import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

import {
  booksRoutes,
  studentsRoutes,
  librariansRoutes,
  authorsRoutes,
  settingsRoutes,
  authRoutes
} from './routes/index';

export const routes: Route[] = [
  ...authRoutes,
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books', canActivate: [authGuard], children: booksRoutes },
  { path: 'students', canActivate: [authGuard], children: studentsRoutes },
  { path: 'librarians', canActivate: [authGuard], children: librariansRoutes },
  { path: 'authors', canActivate: [authGuard], children: authorsRoutes },
  { path: 'settings', canActivate: [authGuard], children: settingsRoutes },
  { path: '**', redirectTo: '/dashboard' }
];


