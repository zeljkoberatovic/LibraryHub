import { Route } from '@angular/router';
import { authRoutes } from '@/app/auth/auth/auth.routes';
import { DashboardComponent } from '@/app/pages/dashboard/dashboard.component';
import { authGuard } from '@/app/core/guards/auth.guard';
import { booksRoutes } from '@/app/routes/books/books.routes';
import { studentsRoutes } from '@/app/routes/students/students.routes';
import { librariansRoutes } from '@/app/routes/librarians/librarians.routes';
import { authorsRoutes } from '@/app/routes/authors/authors.routes';
import { settingsRoutes } from '@/app/routes/settings/settings.routes';
import { issuingRoutes } from '@/app/routes/issuing/issuing.routes'; 

export const routes: Route[] = [
  ...authRoutes,
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books', canActivate: [authGuard], children: booksRoutes },
  { path: 'students', canActivate: [authGuard], children: studentsRoutes },
  { path: 'librarians', canActivate: [authGuard], children: librariansRoutes },
  { path: 'authors', canActivate: [authGuard], children: authorsRoutes },
  { path: 'settings', canActivate: [authGuard], children: settingsRoutes },
  { path: 'issuing', canActivate: [authGuard], children: issuingRoutes },
  { path: '**', redirectTo: '/dashboard' }
];


