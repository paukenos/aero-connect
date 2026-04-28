import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PassengerBookFacade } from '../../features/passenger/passenger-book.facade';
import { PassengerProfile } from '../models/passengers.model';

//esto lo estamos llamando en el routes de passenger
export const passengersResolver: ResolveFn<PassengerProfile[]> = () => {
  const passengerService = inject(PassengerBookFacade);
  return passengerService.loadAll();
};
