import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { librarianResolver } from '../app/resolvers/librarian/librarian.resolver'; 
import { studentResolver } from '../app/resolvers/student/student-resolver';
import { bookResolver } from '../app/resolvers/book/book-resolver';
import { authorResolver } from './resolvers/author/author-resolver';

import { authGuard } from './core/guards/auth.guard';

import { SettingsComponent } from './pages/settings/settings.component';
import { PublishersResolver } from './resolvers/settings/publishers/publisher-resolver';
import { GenresResolver } from './resolvers/settings/genre/genre-resolver';
import { CategoryResolver } from './resolvers/settings/category/category-resolver';
import { BookSettingsComponent } from './pages/settings/book-settings/book-settings.component';

export const routes: Route[] = [
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
  },

  // Auth routes
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login/login.component').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/pages/register/register.component').then(m => m.Register)
  },

  // Public dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  // Librarians routes (zaštićeno)
  {
    path: 'librarians',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/librarians/librarians/librarians.component').then(m => m.Librarians)
  },
  {
    path: 'librarians/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/librarians/new-librarian/new-librarian.component').then(m => m.NewLibrarian)
  },
  {
    path: 'librarians/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/librarians/view-librarian/view-librarian.component').then(m => m.ViewLibrarian),
    resolve: { librarian: librarianResolver }
  },
  {
    path: 'librarians/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/librarians/edit-librarian/edit-librarian.component').then(m => m.EditLibrarian),
    resolve: { librarian: librarianResolver }
  },

  // Students routes (zaštićeno)
  {
    path: 'students',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/student/students/students.component').then(m => m.Students)
  },
  {
    path: 'students/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/student/new-student/new-student.component').then(m => m.NewStudent)
  },
  {
    path: 'students/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/student/view-student/view-student.component').then(m => m.ViewStudent),
    resolve: { student: studentResolver }
  },
  {
    path: 'students/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/student/edit-student/edit-student.component').then(m => m.EditStudent),
    resolve: { student: studentResolver }
  },

  // Authors routes (zaštićeno)
  {
    path: 'authors',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/authors/authors/authors.component').then(m => m.Authors)
  },
  {
    path: 'authors/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/authors/new-author/new-author.component').then(m => m.NewAuthor)
  },
  {
    path: 'authors/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/authors/view-author/view-author.component').then(m => m.ViewAuthor),
    resolve: { author: authorResolver }
  },
  {
    path: 'authors/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/authors/edit-author/edit-author.component').then(m => m.EditAuthor),
    resolve: { author: authorResolver }
  },

  // Settings routes (zaštićeno)
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      {
        path: 'categories',
        canActivate: [authGuard],
        resolve: { categories: CategoryResolver },
        loadComponent: () =>
          import('./pages/settings/categories/categories.component').then(
            (m) => m.CategoryComponent
          ),
      },
      {
        path: 'genres',
        canActivate: [authGuard],
        resolve: { genres: GenresResolver },
        loadComponent: () =>
          import('./pages/settings/genre/genres.component').then(
            (m) => m.GenreComponent
          ),
      },
      {
        path: 'publishers',
        canActivate: [authGuard],
        resolve: { publishers: PublishersResolver },
        loadComponent: () =>
          import('./pages/settings/publishers/publishers.component').then(
            (m) => m.PublishersComponent
          ),
      },
      {
        path: 'bindings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/settings/book-settings/book-settings.component').then(
            (m) => m.BookSettingsComponent
          ),
      },
      {
        path: 'formats',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/settings/book-settings/book-settings.component').then(
            (m) => m.BookSettingsComponent
          ),
      },
      {
        path: 'languages',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/settings/book-settings/book-settings.component').then(
            (m) => m.BookSettingsComponent
          ),
      },
    ],
  },

  // Books routes (zaštićeno)
  {
    path: 'books',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/books/books/books.component').then(m => m.Books),
  },
  {
    path: 'books/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/books/new-book/new-book.component').then(m => m.NewBookComponent),
    children: [
      {
        path: 'details',
        loadComponent: () =>
          import('../app/pages/books/new-book/book-details-form/book-details-form.component').then(m => m.BookDetailsFormComponent)
      },
      {
        path: 'specification',
        loadComponent: () =>
          import('../app/pages/books/new-book/book-spec-form/book-spec-form.component').then(m => m.BookSpecFormComponent)
      },
      {
        path: 'media',
        loadComponent: () =>
          import('../app/pages/books/new-book/book-media-form/book-media-form.component').then(m => m.BookMediaFormComponent)
      },
      { path: '', redirectTo: 'details', pathMatch: 'full' }
    ]
  },
  {
    path: 'books/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/books/edit-book/edit-book.component').then(m => m.EditBook),
    resolve: {
      book: bookResolver
    }
  },
  {
    path: 'books/view/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/books/view-book/view-book.component').then(m => m.ViewBook),
    resolve: {
      book: bookResolver
    },
    children: [
      {
        path: 'details',
        loadComponent: () =>
          import('../app/pages/books/view-book/book-details/book-details.component').then(m => m.BookDetails),
        resolve: { book: bookResolver }
      },
      {
        path: 'specification',
        loadComponent: () =>
          import('../app/pages/books/view-book/book-spec/book-spec.component').then(m => m.BookSpec),
        resolve: { book: bookResolver}
      },
      {
        path: 'records',
        loadComponent: () => import('../app/pages/books/view-book/book-records/book-records.component').then(m => m.BookRecords),
        children: [
          { 
            path: 'rented', 
            loadComponent: () => import('../app/pages/books/view-book/book-records/records/rented/rented.component').then(m => m.RentedComponent) 
          },
          { 
            path: 'rented/:rentalId/details',
            loadComponent: () => import('../app/pages/books/view-book/book-records/records/rented/view-details/view-details.component').then(m => m.ViewDetailsComponent)
          },
          { 
            path: 'rented/:rentalId/lost',
            loadComponent: () => import('../app/pages/books/view-book/book-records/records/rented/mark-as-lost/mark-as-lost.component').then(m => m.MarkAsLostComponent)
          },
          { 
            path: 'rented/:rentalId/return',
            loadComponent: () => import('../app/pages/books/view-book/book-records/records/rented/return-book/return-book.component').then(m => m.ReturnBookComponent)
          },
          { 
            path: 'returned', 
            loadComponent: () => import('../app/pages/books/view-book/book-records/records/returned/returned.component').then(m => m.ReturnedComponent) 
          },
          { 
            path: 'overdue', 
            loadComponent: () => import('../app/pages/books/view-book/book-records/records/overdue/overdue.component').then(m => m.OverdueComponent) 
          },
          { 
            path: 'active-res', 
            loadComponent: () => import('./pages/books/view-book/book-records/records/active-res/active-res.component').then(m => m.ActiveResComponent) 
          },
          { 
            path: 'archived-res', 
            loadComponent: () => import('../app/pages/books/view-book/book-records/records/archived-res/archived-res').then(m => m.ArchivedResComponent) 
          },
          { path: '', redirectTo: 'rented', pathMatch: 'full' }
        ]
      },
      {
        path: 'media',
        loadComponent: () =>
          import('../app/pages/books/view-book/book-media/book-media.component').then(m => m.BookMedia),
        resolve: { book: bookResolver}
      },

      // ---- book action routes ----
      {
        path: 'issue',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../app/pages/books/view-book/book-actions/issue-book/issue-book.component').then(m => m.IssueBookComponent)
      },
      {
        path: 'reserve',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../app/pages/books/view-book/book-actions/reserve-book/reserve-book.component').then(m => m.ReserveBookComponent)
      },
      // --------------------------------

      { path: '', redirectTo: 'details', pathMatch: 'full' }
    ]
  },

  // Catch-all (404)
  { path: '**', redirectTo: '/dashboard' }
];