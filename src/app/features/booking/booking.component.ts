import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { FlightService } from '../../core/services/flight.service';
import { Flight } from '../../core/models/flight.model';

interface PassengerForm {
  firstName: string;
  lastName: string;
  documentType: 'dni' | 'passport';
  documentNumber: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _flightService = inject(FlightService);
  private _bookingService = inject(BookingService);

  flight: Flight | null = this._route.snapshot.data['flight'] ?? null;
  isLoadingFlight = false;
  isSubmitting = false;
  error: string | null = null;

  readonly bookingForm = new FormGroup({
    contactEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    passengers: new FormArray(
      Array.from(
        { length: Number(this._route.snapshot.queryParams['passengers'] ?? 1) },
        () => this._createPassengerGroup()
      )
    ),
  });

  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  get totalPrice(): number {
    return (this.flight?.basePrice ?? 0) * this.passengers.length;
  }

  ngOnInit(): void {
    if (this.flight) return;
    const id = this._route.snapshot.paramMap.get('id') ?? '';
    this.isLoadingFlight = true;
    this._flightService.getById(id).subscribe({
      next: (flight) => {
        this.flight = flight;
        this.isLoadingFlight = false;
      },
      error: () => {
        this.error = 'No se ha podido cargar la información del vuelo.';
        this.isLoadingFlight = false;
      },
    });
  }

  submit(): void {
    if (!this.flight || this.bookingForm.invalid) return;

    this.isSubmitting = true;
    this.error = null;

    const { contactEmail, passengers } = this.bookingForm.getRawValue();

    this._bookingService.create({
      flightId: this.flight.id,
      passengers: passengers.map((passenger: PassengerForm) => ({
        ...passenger,
        email: contactEmail,
      })),
    }).subscribe({
      next: (confirmation) => {
        this._router.navigate(['/confirmation'], { state: { confirmation } });
      },
      error: () => {
        this.error = 'No se ha podido completar la reserva. IntÃ©ntalo de nuevo.';
        this.isSubmitting = false;
      },
    });
  }

  getPassengerDocumentPlaceholder(index: number): string {
    const passenger = this.passengers.at(index);
    const documentType = passenger.get('documentType')?.value;
    return documentType === 'dni' ? '12345678A' : 'AAB123456';
  }

  private _createPassengerGroup() {
    return new FormGroup({
      firstName: new FormControl('', { nonNullable: true, validators: Validators.required }),
      lastName: new FormControl('', { nonNullable: true, validators: Validators.required }),
      documentType: new FormControl<'dni' | 'passport'>('dni', { nonNullable: true }),
      documentNumber: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });
  }
}
