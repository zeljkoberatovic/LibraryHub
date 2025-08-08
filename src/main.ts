import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter }        from '@angular/router';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import {  withInterceptors } from '@angular/common/http';

<<<<<<< HEAD
import { App }      from './app/app';
import { routes }   from './app/routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth-interceptor';
=======
import { App }                  from './app/app';
import { routes }               from './app/routes';
import { AuthInterceptor }      from './app/shared/interceptors/auth.interceptor';
>>>>>>> settings

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),  
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideRouter(routes),
<<<<<<< HEAD
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
  ],
});

=======
    provideBrowserGlobalErrorListeners()
  ]
}).catch(err => console.error(err));
>>>>>>> settings
