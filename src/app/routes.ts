import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Librarians } from './pages/librarians/librarians/librarians';
import { NewLibrarian } from './pages/librarians/new-librarian/new-librarian';


// import other components…

export const routes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bibliotekari', component: Librarians },
  { path: 'noviBibliotekar', component: NewLibrarian },
  { path: 'bibliotekari/:id', loadComponent: () => import('./pages/librarians/view-librarian/view-librarian').then(m => m.ViewLibrarian) },
{
  path: 'bibliotekari/:id/izmjena',
  loadComponent: () =>
    import('./pages/librarians/edit-librarian/edit-librarian').then(m => m.EditLibrarian)
}

 
 
  // …others…
];
