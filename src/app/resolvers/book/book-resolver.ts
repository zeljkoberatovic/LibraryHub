import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BookService } from '../../services/book/book.service';
import { Book } from '../../models/book.model';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const bookResolver: ResolveFn<Book | null> = (route) => {
  const service = inject(BookService);
  const id = Number(route.paramMap.get('id'));

  if (!id) return of(null);

  return service.getBook(id).pipe(
    catchError(() => of(null))
  );
};
