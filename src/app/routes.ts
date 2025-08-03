import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
 

import { librarianResolver } from '../app/resolvers/librarian/librarian.resolver'; 
import { studentResolver } from '../app/resolvers/student/student-resolver';

export const routes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'bibliotekari',
    loadComponent: () => import('./pages/librarians/librarians/librarians.component').then(m => m.Librarians)
  },
  {
    path: 'noviBibliotekar',
    loadComponent: () => import('./pages/librarians/new-librarian/new-librarian.component').then(m => m.NewLibrarian)
  },
  {
    path: 'bibliotekari/:id',
    loadComponent: () => import('./pages/librarians/view-librarian/view-librarian.component').then(m => m.ViewLibrarian),
    resolve: {
      librarian: librarianResolver
    }
  },
  {
    path: 'bibliotekari/:id/izmjena',
    loadComponent: () => import('./pages/librarians/edit-librarian/edit-librarian.component').then(m => m.EditLibrarian),
    resolve: {
      librarian: librarianResolver
    }
  },

   {
    path: 'students',
    loadComponent: () => import('./pages/student/students/students').then(m => m.Students)
  },
  {
    path: 'students/new',
    loadComponent: () => import('./pages/student/new-student/new-student').then(m => m.NewStudent)
  },
  {
    path: 'students/:id',
    loadComponent: () => import('./pages/student/view-student/view-student').then(m => m.ViewStudent),
    resolve: {
      student: studentResolver
    }
  },
  {
    path: 'students/:id/edit',
    loadComponent: () => import('./pages/student/edit-student/edit-student').then(m => m.EditStudent),
    resolve: {
      student: studentResolver
    }
  }
];


