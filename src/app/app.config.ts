import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { LOCALE_ID } from '@angular/core';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'es-ES' },
    //aquí añadimos el interceptor de autenticación para que se ejecute en cada petición http y añada el token de autenticación si el usuario está logueado
    //aqui le podriamos meter un LoadInterceptor, ErrorInterceotor, DelayInterceptor.... El orden de ejecución viene dado por como lo ponemos en en el array de interceptors
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
