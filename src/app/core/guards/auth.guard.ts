import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  //injectamos el servicio de auth para comprobar si el usuario está autenticado
  const auth = inject(AuthService);
  const router = inject(Router);
  //el parseUrl lo usamos para redirigir al usuario a la página de login si no está autenticado porquecrea el urlTree
  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};
