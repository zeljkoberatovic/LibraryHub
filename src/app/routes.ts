import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
 

import { librarianResolver } from '../app/resolvers/librarian/librarian.resolver'; 

export const routes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
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
    resolve: {
      librarian: librarianResolver
    }
  },
  {
    path: 'librarians/:id/edit',
    loadComponent: () => import('./pages/librarians/edit-librarian/edit-librarian.component').then(m => m.EditLibrarian),
    resolve: {
      librarian: librarianResolver
    }
  }
];


