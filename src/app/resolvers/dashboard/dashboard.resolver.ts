
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DashboardData {
  stats: {
    books: number;
    students: number;
    rentals: number;
  };
  notifications: Array<{ message: string; date: Date }>;
}

export const dashboardResolver: ResolveFn<DashboardData | null> = () => {
  const service = inject(DashboardService);
  return service.getDashboardData().pipe(
    catchError((error) => {
      console.error('Dashboard resolver error:', error);
      return of(null);
    })
  );
};

