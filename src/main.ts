import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }        from '@angular/router';
import { provideBrowserGlobalErrorListeners } from '@angular/core';

import { App }      from './app/app';
import { routes }   from './app/routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners()
  ]
});
