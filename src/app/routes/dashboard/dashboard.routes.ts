import { Route } from '@angular/router';
import { dashboardResolver } from '@/app/resolvers/dashboard/dashboard.resolver';

export const dashboardRoutes: Route[] = [
	{
		path: '',
		loadComponent: () => import('@/app/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
		resolve: { data: dashboardResolver }
	}
];
