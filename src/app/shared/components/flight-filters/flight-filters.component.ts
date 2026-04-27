import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime } from 'rxjs/operators';
import { FlightSearchService } from '../../../features/search-results/services/flight-search.service';

@Component({
  selector: 'app-flight-filters',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './flight-filters.component.html',
  styleUrl: './flight-filters.component.scss',
})
export class FlightFiltersComponent {
  private _flightSearchService = inject(FlightSearchService);

  readonly filtersForm = new FormGroup({
    maxPrice: new FormControl<number | null>(null),
    sortBy: new FormControl<'price' | 'departure' | 'duration'>('price', { nonNullable: true }),
  });
  private _sortByChanges = toSignal(
    this.filtersForm.controls.sortBy.valueChanges.pipe(debounceTime(300)),
    { initialValue: this.filtersForm.controls.sortBy.getRawValue() }
  );
  private _maxPriceChanges = toSignal(
    this.filtersForm.controls.maxPrice.valueChanges.pipe(debounceTime(300)),
    { initialValue: this.filtersForm.controls.maxPrice.getRawValue() }
  );


  constructor() {
    effect(() => {
      this.filtersForm.patchValue({
        maxPrice: this._flightSearchService.maxPrice(),
        sortBy: this._flightSearchService.sortBy(),
      }, { emitEvent: false });
    });

    effect(() => {
      this._flightSearchService.setSortBy(this._sortByChanges());
    });

    effect(() => {
      this._flightSearchService.setMaxPrice(this._maxPriceChanges());
    });
  }
}
