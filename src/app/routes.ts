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
    path: 'bibliotekari',
    loadComponent: () => import('./pages/librarians/librarians/librarians').then(m => m.Librarians)
  },
  {
    path: 'noviBibliotekar',
    loadComponent: () => import('./pages/librarians/new-librarian/new-librarian').then(m => m.NewLibrarian)
  },
  {
    path: 'bibliotekari/:id',
    loadComponent: () => import('./pages/librarians/view-librarian/view-librarian').then(m => m.ViewLibrarian),
    resolve: {
      librarian: librarianResolver
    }
  },
  {
    path: 'bibliotekari/:id/izmjena',
    loadComponent: () => import('./pages/librarians/edit-librarian/edit-librarian').then(m => m.EditLibrarian),
    resolve: {
      librarian: librarianResolver
    }
  }
];


