import { Route } from '@angular/router';
import { librarianResolver } from '@/app/resolvers/librarian/librarian.resolver';
import { authGuard } from '@/app/core/guards/auth.guard';

export const librariansRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/librarians/librarians/librarians.component').then(m => m.Librarians)
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/librarians/new-librarian/new-librarian.component').then(m => m.NewLibrarian)
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/librarians/view-librarian/view-librarian.component').then(m => m.ViewLibrarian),
    resolve: { librarian: librarianResolver }
  },
  {
    path: ':id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/librarians/edit-librarian/edit-librarian.component').then(m => m.EditLibrarian),
    resolve: { librarian: librarianResolver }
  }
];