import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RentalService } from '@/app/services/rental/rental.service';
import { Rental } from '@/app/models/rental.model';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const rentedCopiesResolver: ResolveFn<Rental[]> = (route) => {
  const rentalService = inject(RentalService);
  const bookId = Number(route.paramMap.get('id'));
  if (!bookId) return of([]);
  return rentalService.getRentedByBook(bookId).pipe(
    catchError(() => of([]))
  );
};