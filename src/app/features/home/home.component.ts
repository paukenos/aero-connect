import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private _router = inject(Router);

  readonly searchForm = new FormGroup({
    origin: new FormControl('', {
      validators: Validators.required,
    }),
    destination: new FormControl('', {
      validators: Validators.required,
    }),
    date: new FormControl('', {
      validators: Validators.required,
    }),
    passengers: new FormControl(1, { nonNullable: true }),
  });

  readonly airports = [
    { code: 'BCN', city: 'Barcelona' },
    { code: 'MAD', city: 'Madrid' },
    { code: 'VLC', city: 'Valencia' },
    { code: 'SVQ', city: 'Sevilla' },
    { code: 'PMI', city: 'Palma de Mallorca' },
    { code: 'LPA', city: 'Las Palmas' },
  ];

  search(): void {
    if (this.searchForm.invalid) return;

    const { origin, destination, date, passengers } =
      this.searchForm.getRawValue();

    //*con los params le paso a la siguiente pagina los datos que queremos
    this._router.navigate(['/flights'], {
      queryParams: {
        origin,
        destination,
        date,
        passengers,
      },
    });
  }
}
