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
 
 
  // …others…
];
