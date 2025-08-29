import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors, } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './routes';
import { authInterceptor } from '../app/core/interceptors/auth-interceptor';
import { errorInterceptor } from '../app/core/interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideRouter(routes)
  ]
};