import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenService } from '../../auth/services/auth-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authTokenService = inject(AuthTokenService);
  
  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

  const token = authTokenService.get();
  
  if (token) {
    // Laravel Sanctum očekuje "Bearer" prefix
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  return next(req);
};