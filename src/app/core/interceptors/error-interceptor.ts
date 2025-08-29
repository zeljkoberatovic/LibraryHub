import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from '../interceptors/auth-token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authTokenService = inject(AuthTokenService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authTokenService.remove();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};