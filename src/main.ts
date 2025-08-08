import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideBrowserGlobalErrorListeners } from '@angular/core';

import { App } from './app/app';
import { routes } from './app/routes';
import { authInterceptor } from './app/interceptors/auth-interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]) 
    ),
    provideRouter(routes),
    provideBrowserGlobalErrorListeners()
  ],
}).catch(err => console.error(err));
