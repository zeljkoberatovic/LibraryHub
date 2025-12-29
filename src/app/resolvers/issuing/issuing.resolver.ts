import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { RentalService } from '@/app/services/rental/rental.service';
import { Rental } from '@/app/models/rental.model';

@Injectable({ providedIn: 'root' })
export class IssuingResolver implements Resolve<any> {
  constructor(private rentalService: RentalService) {}

  resolve(): Observable<{ rented: Rental[]; returned: Rental[]; overdue: Rental[] }> {
    return forkJoin({
      rented: this.rentalService.getRented(),
      returned: this.rentalService.getReturned(),
      overdue: this.rentalService.getOverdue()
    });
  }
}
