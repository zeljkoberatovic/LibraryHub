import { Routes } from '@angular/router';
import { IssuingComponent } from '@/app/pages/issuing/issuing.component';

export const issuingRoutes: Routes = [
  {
    path: '',
    component: IssuingComponent,
    children: [
      {
        path: 'issued',
        loadComponent: () =>
          import('@/app/pages/issuing/issued-books/issued-books.component').then(m => m.IssuedBooksComponent)
      },
      {
        path: 'returned',
        loadComponent: () =>
          import('@/app/pages/issuing/returned-books/returned-books.component').then(m => m.ReturnedBooksComponent)
      },
      {
        path: 'overdue',
        loadComponent: () =>
          import('@/app/pages/issuing/overdue-books/overdue-books.component').then(m => m.OverdueBooksComponent)
      },
      {
        path: 'active-reservations',
        loadComponent: () =>
          import('@/app/pages/issuing/active-res/active-res.component').then(m => m.ActiveResComponent)
      },
      {
        path: 'archived-reservations',
        loadComponent: () =>
          import('@/app/pages/issuing/archived-res/archived-res.component').then(m => m.ArchivedResComponent)
      },
      { path: '', redirectTo: 'issued', pathMatch: 'full' }
    ]
  }
];