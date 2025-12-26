import { Route } from '@angular/router';
import { authRoutes } from '@/app/auth/auth/auth.routes';
import { DashboardComponent } from '@/app/pages/dashboard/dashboard.component';
import { authGuard } from '@/app/core/guards/auth.guard';
import { booksRoutes } from '@/app/routes/books/books.routes';
import { studentsRoutes } from '@/app/routes/students/students.routes';
import { librariansRoutes } from '@/app/routes/librarians/librarians.routes';
import { authorsRoutes } from '@/app/routes/authors/authors.routes';
import { settingsRoutes } from '@/app/routes/settings/settings.routes';
import { profileRoutes } from '@/app/routes/profile/profile.routes';

export const routes: Route[] = [
  ...authRoutes,
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books', canActivate: [authGuard], children: booksRoutes },
  { path: 'students', canActivate: [authGuard], children: studentsRoutes },
  { path: 'librarians', canActivate: [authGuard], children: librariansRoutes },
  { path: 'authors', canActivate: [authGuard], children: authorsRoutes },
  { path: 'settings', canActivate: [authGuard], children: settingsRoutes },
  { path: 'profile', canActivate: [authGuard], children: profileRoutes },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];


