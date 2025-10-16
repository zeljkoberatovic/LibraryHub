import { Route } from '@angular/router';

export const authRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@/app/auth/pages/login/login.component').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('@/app/auth/pages/register/register.component').then(m => m.Register)
  }
];