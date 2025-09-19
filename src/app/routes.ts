import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { librarianResolver } from '../app/resolvers/librarian/librarian.resolver'; 
import { studentResolver } from '../app/resolvers/student/student-resolver';
import { bookResolver } from '../app/resolvers/book/book-resolver';

import { SettingsComponent } from './pages/settings/settings.component';
import { GenreComponent } from './pages/settings/genre/genres.component';
import { PublisherComponent } from './pages/settings/publishers/publishers.component';
import { BindingComponent } from './pages/settings/bindings/bindings.component';
import { FormatComponent } from './pages/settings/formats/formats.component';
import { LanguageComponent } from './pages/settings/languages/languages.component';
import { authorResolver } from './resolvers/author/author-resolver';
import { authGuard } from './core/guards/auth.guard';

export const routes: Route[] = [
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
      loadComponent: () =>
        import('./pages/settings/categories/categories.component').then(
          (m) => m.CategoryComponent
        ),
      
    },
    {
      path: 'genres',
      component: GenreComponent,
      canActivate: [authGuard]

    },
    {
      path: 'publishers',
      component: PublisherComponent,
      canActivate: [authGuard]
    },
    {
      path: 'bindings',
      component: BindingComponent,
      canActivate: [authGuard]
    },
    {
      path: 'formats',
      component: FormatComponent,
      canActivate: [authGuard]
    },
    {
      path: 'languages',
      component: LanguageComponent,
      canActivate: [authGuard]
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
        import('../app/pages/books/view-book/book-details/book-details.component').then(m => m.BookDetails)
    },
    {
      path: 'specification',
      loadComponent: () =>
        import('../app/pages/books/view-book/book-spec/book-spec.component').then(m => m.BookSpec)
    },
    {
      path: 'records',
      loadComponent: () =>
        import('../app/pages/books/view-book/book-records/book-records.component').then(m => m.BookRecords)
    },
    {
      path: 'media',
      loadComponent: () =>
        import('../app/pages/books/view-book/book-media/book-media.component').then(m => m.BookMedia)
    },
    { path: '', redirectTo: 'details', pathMatch: 'full' }
  ]
},

  // Catch-all (404)
  { path: '**', redirectTo: '/dashboard' }
];
