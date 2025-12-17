export const notFoundRoutes = [
  {
    path: '**',
    loadComponent: () =>
      import('../../shared/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];