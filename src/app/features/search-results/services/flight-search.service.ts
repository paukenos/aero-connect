import { computed, Injectable, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, EMPTY, forkJoin } from 'rxjs';
import { catchError, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs/operators';
import { Flight, SearchParams } from '../../../core/models/flight.model';
import { FlightService } from '../../../core/services/flight.service';

@Injectable({ providedIn: 'root' })
export class FlightSearchService {
  private _flightService = inject(FlightService);

  private _searchParams = signal<SearchParams | null>(null);
  private _maxPrice = signal<number | null>(null);
  private _sortBy = signal<'price' | 'departure' | 'duration'>('price');
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  private _flights = toSignal(
    toObservable(this._searchParams).pipe(
      filter((searchParams): searchParams is SearchParams => searchParams !== null),
      distinctUntilChanged((prev, curr) => this._sameSearchParams(prev, curr)),
      tap(() => this._startLoading()),
      switchMap((searchParams) =>
        this._flightService.search(searchParams).pipe(
          catchError(() => {
            this._error.set('No se han podido cargar los vuelos. Intentalo de nuevo.');
            return EMPTY;
          }),
          finalize(() => this._isLoading.set(false))
        )
      )
    ),
    { initialValue: [] }
  );

  searchParams = this._searchParams.asReadonly();
  maxPrice = this._maxPrice.asReadonly();
  sortBy = this._sortBy.asReadonly();
  flights = computed(() => this._flights());
  filteredFlights = computed(() => {
    let result = [...this.flights()];

    if (this.maxPrice() !== null) {
      result = result.filter((flight) => flight.basePrice <= this.maxPrice()!);
    }

    result.sort((a, b) => {
      if (this.sortBy() === 'price') return a.basePrice - b.basePrice;
      if (this.sortBy() === 'departure') {
        return a.departureDate.localeCompare(b.departureDate);
      }

      return a.durationMinutes - b.durationMinutes;
    });

    return result;
  });
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  setParams(params: SearchParams): void {
    this._searchParams.set(params);
  }

  setMaxPrice(maxPrice: number | null): void {
    this._maxPrice.set(maxPrice);
  }

  setSortBy(sortBy: 'price' | 'departure' | 'duration'): void {
    this._sortBy.set(sortBy);
  }

  loadFlightWithAirports(
    flightId: string,
  ): Observable<[Flight, { code: string; city: string }[]]> {
    return forkJoin([
      this._flightService.getById(flightId),
      this._flightService.getAirports(),
    ]);
  }

  private _sameSearchParams(prev: SearchParams, curr: SearchParams): boolean {
    return prev.origin === curr.origin
      && prev.destination === curr.destination
      && prev.date === curr.date
      && prev.passengers === curr.passengers;
  }

  private _startLoading(): void {
    this._isLoading.set(true);
    this._error.set(null);
  }
}
