import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { librarianResolver } from '../app/resolvers/librarian/librarian.resolver'; 
import { studentResolver } from '../app/resolvers/student/student-resolver';

import { SettingsComponent } from './pages/settings/settings.component';
import { GenreComponent } from './pages/settings/genre/genres.component';
import { PublisherComponent } from './pages/settings/publishers/publishers.component';
import { BindingComponent } from './pages/settings/bindings/bindings.component';
import { FormatComponent } from './pages/settings/formats/formats.component';
import { LanguageComponent } from './pages/settings/languages/languages.component';

export const routes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  // Librarians routes
  {
    path: 'librarians',
    loadComponent: () => import('./pages/librarians/librarians/librarians.component').then(m => m.Librarians)
  },
  {
    path: 'librarians/new',
    loadComponent: () => import('./pages/librarians/new-librarian/new-librarian.component').then(m => m.NewLibrarian)
  },
  {
    path: 'librarians/:id',
    loadComponent: () => import('./pages/librarians/view-librarian/view-librarian.component').then(m => m.ViewLibrarian),
    resolve: { librarian: librarianResolver }
  },
  {
    path: 'librarians/:id/edit',
    loadComponent: () => import('./pages/librarians/edit-librarian/edit-librarian.component').then(m => m.EditLibrarian),
    resolve: { librarian: librarianResolver }
  },

  // Students routes
  {
    path: 'students',
    loadComponent: () => import('./pages/student/students/students.component').then(m => m.Students)
  },
  {
    path: 'students/new',
    loadComponent: () => import('./pages/student/new-student/new-student.component').then(m => m.NewStudent)
  },
  {
    path: 'students/:id',
    loadComponent: () => import('./pages/student/view-student/view-student.component').then(m => m.ViewStudent),
    resolve: { student: studentResolver }
  },
  {
    path: 'students/:id/edit',
    loadComponent: () => import('./pages/student/edit-student/edit-student.component').then(m => m.EditStudent),
    resolve: { student: studentResolver }
  },

  // Settings routes
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'kategorije', pathMatch: 'full' },
      {
        path: 'kategorije',
        loadComponent: () =>
          import('./pages/settings/categories/categories.component').then(
            (m) => m.CategoryComponent
          ),
      },
      { path: 'zanrovi', component: GenreComponent },
      { path: 'izdavac', component: PublisherComponent },
      { path: 'povez', component: BindingComponent },
      { path: 'format', component: FormatComponent },
      { path: 'pismo', component: LanguageComponent },
    ],
  },
];
