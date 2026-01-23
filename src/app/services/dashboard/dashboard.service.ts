import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RentalService } from '@/app/services/rental/rental.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private rentalService = inject(RentalService);

  getDashboardData(): Observable<any> {
    return forkJoin({
      issued: this.rentalService.getRented().pipe(catchError(() => of([]))),
      returned: this.rentalService.getReturned().pipe(catchError(() => of([]))),
      overdue: this.rentalService.getOverdue().pipe(catchError(() => of([])))
    }).pipe(
      map(({ issued, returned, overdue }) => ({
        stats: {
          rentals: issued.length,
          returned: returned.length,
          overdue: overdue.length
        },
        notifications: [
          { message: 'Dobrodošli na dashboard!', date: new Date() }
        ]
      }))
    );
  }
}
