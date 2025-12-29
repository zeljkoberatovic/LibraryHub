import { Route } from '@angular/router';
import { IssuingResolver } from '../../resolvers/issuing/issuing.resolver';

export const issuingRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('../../pages/issuing/issuing/issuing.component').then(m => m.IssuingComponent),
    resolve: { issuingData: IssuingResolver }
  }
];
