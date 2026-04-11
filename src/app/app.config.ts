import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TenantInterceptor } from './interceptors/intercetor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // Habilita interceptores basados en DI
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TenantInterceptor,
      multi: true // IMPORTANTE: permite tener múltiples interceptores
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
