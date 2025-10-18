import { Route } from '@angular/router';
import { bookResolver } from '@/app/resolvers/book/book-resolver';
import { rentedCopiesResolver } from '../../resolvers/renteds/rented-copies.resolver';
import { authGuard } from '@/app/core/guards/auth.guard';

export const booksRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/books/books/books.component').then(m => m.Books),
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/books/new-book/new-book.component').then(m => m.NewBookComponent),
    children: [
      {
        path: 'details',
        loadComponent: () => import('@/app/pages/books/new-book/book-details-form/book-details-form.component').then(m => m.BookDetailsFormComponent)
      },
      {
        path: 'specification',
        loadComponent: () => import('@/app/pages/books/new-book/book-spec-form/book-spec-form.component').then(m => m.BookSpecFormComponent)
      },
      {
        path: 'media',
        loadComponent: () => import('@/app/pages/books/new-book/book-media-form/book-media-form.component').then(m => m.BookMediaFormComponent)
      },
      { path: '', redirectTo: 'details', pathMatch: 'full' }
    ]
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/books/edit-book/edit-book.component').then(m => m.EditBook),
    resolve: { book: bookResolver }
  },
  {
    path: 'view/:id',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/books/view-book/view-book.component').then(m => m.ViewBook),
    resolve: { book: bookResolver },
    children: [
      {
        path: 'details',
        loadComponent: () => import('@/app/pages/books/view-book/book-details/book-details.component').then(m => m.BookDetails),
        resolve: { book: bookResolver }
      },
      {
        path: 'specification',
        loadComponent: () => import('@/app/pages/books/view-book/book-spec/book-spec.component').then(m => m.BookSpec),
        resolve: { book: bookResolver }
      },
      {
        path: 'records',
        loadComponent: () => import('@/app/pages/books/view-book/book-records/book-records.component').then(m => m.BookRecords),
        children: [
          { 
            path: 'rented', 
            loadComponent: () => import('@/app/pages/books/view-book/book-records/records/rented/rented.component').then(m => m.RentedComponent),
            resolve: { rentedCopies: rentedCopiesResolver }
          },
          { 
            path: 'rented/:rentalId/details',
            loadComponent: () => import('@/app/pages/books/view-book/book-records/records/rented/view-details/view-details.component').then(m => m.ViewDetailsComponent)
          },
          { 
            path: 'rented/:rentalId/lost',
            loadComponent: () => import('@/app/pages/books/view-book/book-records/records/rented/mark-as-lost/mark-as-lost.component').then(m => m.MarkAsLostComponent)
          },
          { 
            path: 'rented/:rentalId/return',
            loadComponent: () => import('@/app/pages/books/view-book/book-records/records/rented/return-book/return-book.component').then(m => m.ReturnBookComponent)
          },
          { 
            path: 'returned', 
            loadComponent: () => import('@/app/pages/books/view-book/book-records/records/returned/returned.component').then(m => m.ReturnedComponent) 
          },
          { 
            path: 'overdue', 
            loadComponent: () => import('@/app/pages/books/view-book/book-records/records/overdue/overdue.component').then(m => m.OverdueComponent) 
          },
          { 
            path: 'active-res', 
            loadComponent: () => import('@/app/pages/books/view-book/book-records/records/active-res/active-res.component').then(m => m.ActiveResComponent) 
          },
          { 
            path: 'archived-res', 
            loadComponent: () => import('@/app/pages/books/view-book/book-records/records/archived-res/archived-res').then(m => m.ArchivedResComponent) 
          },
          { path: '', redirectTo: 'rented', pathMatch: 'full' }
        ]
      },
      {
        path: 'media',
        loadComponent: () => import('@/app/pages/books/view-book/book-media/book-media.component').then(m => m.BookMedia),
        resolve: { book: bookResolver }
      },
      {
        path: 'issue',
        canActivate: [authGuard],
        loadComponent: () => import('@/app/pages/books/view-book/book-actions/issue-book/issue-book.component').then(m => m.IssueBookComponent)
      },
      {
        path: 'reserve',
        canActivate: [authGuard],
        loadComponent: () => import('@/app/pages/books/view-book/book-actions/reserve-book/reserve-book.component').then(m => m.ReserveBookComponent)
      },
      { path: '', redirectTo: 'details', pathMatch: 'full' }
    ]
  }
];