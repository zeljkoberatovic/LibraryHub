import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { GenreComponent } from './pages/settings/genre/genres.component';
import { PublisherComponent } from './pages/settings/publishers/publishers.component';


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
    ],
  },
  
];
