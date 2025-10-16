import { Route } from '@angular/router';
import { SettingsComponent } from '@/app/pages/settings/settings.component';
import { PublishersResolver } from '@/app/resolvers/settings/publishers/publisher-resolver';
import { GenresResolver } from '@/app/resolvers/settings/genre/genre-resolver';
import { CategoryResolver } from '@/app/resolvers/settings/category/category-resolver';
import { BookSettingsComponent } from '@/app/pages/settings/book-settings/book-settings.component';

export const settingsRoutes: Route[] = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      {
        path: 'categories',
        resolve: { categories: CategoryResolver },
        loadComponent: () => import('@/app/pages/settings/categories/categories.component').then(m => m.CategoryComponent)
      },
      {
        path: 'genres',
        resolve: { genres: GenresResolver },
        loadComponent: () => import('@/app/pages/settings/genre/genres.component').then(m => m.GenreComponent)
      },
      {
        path: 'publishers',
        resolve: { publishers: PublishersResolver },
        loadComponent: () => import('@/app/pages/settings/publishers/publishers.component').then(m => m.PublishersComponent)
      },
      {
        path: 'bindings',
        loadComponent: () => import('@/app/pages/settings/book-settings/book-settings.component').then(m => m.BookSettingsComponent)
      },
      {
        path: 'formats',
        loadComponent: () => import('@/app/pages/settings/book-settings/book-settings.component').then(m => m.BookSettingsComponent)
      },
      {
        path: 'languages',
        loadComponent: () => import('@/app/pages/settings/book-settings/book-settings.component').then(m => m.BookSettingsComponent)
      }
    ]
  }
];