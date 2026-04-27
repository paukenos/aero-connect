import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

//el interceptor sirve para meterle información a la petición antes de que se envie
//el req es la peticion que se va a enviar y el next es la funcion encargada de enviar la funcion
//el next devuelve un observable con la respuest ade la peticion
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    //se suele usar clone porque las peticiones son inmutables, si queremos modificar la petición tenemos que clonarla y modificar el clon
    const r = req.clone({
      setHeaders: {
        //esto es el formato de token de autenticacion
        Authorization: `Bearer ${auth.getToken()}`,
      },
    });
    return next(r);
  }
  //si le metiesemos un pipe, estariamos operando la respuesta
  return next(req);
};
