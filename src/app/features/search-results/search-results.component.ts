import { A11yModule } from '@angular/cdk/a11y';
import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavegacionService } from '../../core/services/navegacion.service';
import { FlightFiltersComponent } from '../../shared/components/flight-filters/flight-filters.component';
import { FlightListComponent } from '../../shared/components/flight-list/flight-list.component';
import { SharedErrorComponent } from '../../shared/components/shared-error/shared-error.component';
import { SharedLoaderComponent } from '../../shared/components/shared-loader/shared-loader.component';
import { FlightSearchService } from './services/flight-search.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    FlightFiltersComponent,
    FlightListComponent,
    A11yModule,
    SharedLoaderComponent,
    SharedErrorComponent,
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _navegacionService = inject(NavegacionService);
  private _flightSearchService = inject(FlightSearchService);

  isLoading = this._flightSearchService.isLoading;
  error = this._flightSearchService.error;
  filteredFlights = this._flightSearchService.filteredFlights;
  //con esto obtengo los filtros del servicio
  readonly filters = computed(() => ({
    maxPrice: this._flightSearchService.maxPrice(),
    sortBy: this._flightSearchService.sortBy(),
  }));

  //inicializacion del componente con los datos de busqueda obtenidos por losquery params
  ngOnInit(): void {
    const qp = this._route.snapshot.queryParams;

    this._flightSearchService.setParams({
      origin: qp['origin'] ?? '',
      destination: qp['destination'] ?? '',
      date: qp['date'] ?? '',
      passengers: Number(qp['passengers'] ?? 1),
    });
  }

  goBack(): void {
    this._navegacionService.goBack();
  }

  //funcion para actualizar los filtros en el servicio
  onFiltersChange(filters: {
    maxPrice: number | null;
    sortBy: 'price' | 'departure' | 'duration';
  }): void {
    this._flightSearchService.setMaxPrice(filters.maxPrice);
    this._flightSearchService.setSortBy(filters.sortBy);
  }
}
