import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getDashboardData(): Observable<any> {
    
    return of({
      stats: {
        books: 1200,
        students: 350,
        rentals: 780
      },
      notifications: [
        { message: 'Dobrodošli na dashboard!', date: new Date() }
      ]
    });
  }
}
