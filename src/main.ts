import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }        from '@angular/router';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import {  withInterceptors } from '@angular/common/http';

import { App }      from './app/app';
import { routes }   from './app/routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth-interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
  ],
});

