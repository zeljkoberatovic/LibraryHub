import { Route } from '@angular/router';

export const profileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@/app/pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
  }
];
