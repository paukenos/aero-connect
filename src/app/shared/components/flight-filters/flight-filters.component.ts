import { Component, effect, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, map } from 'rxjs/operators';

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
  filters = input.required<{
    maxPrice: number | null;
    sortBy: 'price' | 'departure' | 'duration';
  }>();

  filtersChange = output<{
    maxPrice: number | null;
    sortBy: 'price' | 'departure' | 'duration';
  }>();

  readonly filtersForm = new FormGroup({
    maxPrice: new FormControl<number | null>(null),
    sortBy: new FormControl<'price' | 'departure' | 'duration'>('price', {
      nonNullable: true,
    }),
  });

  constructor() {
    effect(() => {
      this.filtersForm.patchValue(this.filters(), { emitEvent: false });
    });

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        map((value) => ({
          maxPrice: value.maxPrice ?? null,
          sortBy: value.sortBy ?? 'price',
        })),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        this.filtersChange.emit(value);
      });
  }
}
