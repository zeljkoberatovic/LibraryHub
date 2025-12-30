import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const dashboardResolver: ResolveFn<any> = () => {
  const service = inject(DashboardService);
  return service.getDashboardData().pipe(
    catchError(() => of(null))
  );
};

