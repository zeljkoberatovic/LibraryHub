import { Route } from '@angular/router';

export const issuingRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../../pages/issuing/issuing/issuing.component').then(m => m.IssuingComponent)
  }
];
