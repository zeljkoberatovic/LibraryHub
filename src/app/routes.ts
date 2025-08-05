import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { GenreComponent } from './pages/settings/genre/genres.component';
import { PublisherComponent } from './pages/settings/publishers/publishers.component';
import { BindingComponent } from './pages/settings/bindings/bindings.component';
import { FormatComponent } from './pages/settings/formats/formats.component';
import { LanguageComponent } from './pages/settings/languages/languages.component';

export const routes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'kategorije', pathMatch: 'full' },

      {
        path: 'kategorije',
        loadComponent: () =>
          import('./pages/settings/categories/categories.component').then(
            (m) => m.CategoryComponent
          ),
      },
      { path: 'zanrovi', component: GenreComponent },
      { path: 'izdavac', component: PublisherComponent },
      { path: 'povez', component: BindingComponent },
      { path: 'format', component: FormatComponent },
      { path: 'pismo', component: LanguageComponent },
    ],
  },
];
