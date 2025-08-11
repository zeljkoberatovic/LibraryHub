import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthorService } from '../../services/author/author.service';
import { Author } from '../../models/author.model';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authorResolver: ResolveFn<Author | null> = (route) => {
  const service = inject(AuthorService);
  const id = Number(route.paramMap.get('id'));

  if (!id) return of(null);

  return service.getAuthor(id).pipe(
    catchError(() => of(null))
  );
};
