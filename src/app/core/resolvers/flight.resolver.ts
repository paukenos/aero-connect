import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Flight } from '../models/flight.model';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { FlightService } from '../services/flight.service';

export const flightResolver: ResolveFn<Flight> = (route, state) => {
  const flightService = inject(FlightService);
  const router = inject(Router);

  // el resolver carga la información antes de que se cargue el componente
  //si el id no es un numero, redirigimos a home mediante el catch error, el resolver tiene que devolver un observable, por eso usamos of para devolver un observable con el RedirectCommand
  return flightService.getById(route.paramMap.get('id')!).pipe(
    catchError((error) => {
      console.log(error);
      //el of te lo devuelve como un observable
      return of(new RedirectCommand(router.parseUrl('/home')));
    }),
  );
};
