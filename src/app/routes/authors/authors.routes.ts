import { Route } from '@angular/router';
import { authorResolver } from '@/app/resolvers/author/author-resolver';
import { authGuard } from '@/app/core/guards/auth.guard';

export const authorsRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/authors/authors/authors.component').then(m => m.Authors)
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/authors/new-author/new-author.component').then(m => m.NewAuthor)
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/authors/view-author/view-author.component').then(m => m.ViewAuthor),
    resolve: { author: authorResolver }
  },
  {
    path: ':id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/pages/authors/edit-author/edit-author.component').then(m => m.EditAuthor),
    resolve: { author: authorResolver }
  }
];