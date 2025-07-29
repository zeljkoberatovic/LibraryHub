import { Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { LibrarianService } from '../../services/librarian/librarian';
import { User } from '../../models/user.model';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const librarianResolver: ResolveFn<User | null> = (route) => {
  const service = inject(LibrarianService);
  const id = Number(route.paramMap.get('id'));

  if (!id) return of(null);

  return service.getLibrarian(id).pipe(
    catchError(() => of(null))
  );
};
