import {
  ApplicationConfig, inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { authInterceptor } from './auth/infrastructure/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    //Httpclient + Interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
