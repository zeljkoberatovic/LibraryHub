import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { StudentService } from '../../services/student/student.service';
import { User } from '../../models/user.model';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const studentResolver: ResolveFn<User | null> = (route) => {
  const service = inject(StudentService);
  const id = Number(route.paramMap.get('id'));

  if (!id) return of(null);

  return service.getStudent(id).pipe(
    catchError(() => of(null))
  );
};
