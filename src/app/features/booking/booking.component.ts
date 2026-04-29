import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
        () => this._createPassengerGroup(),
      ),
    ),
  });

  //*lo ponemos como formArray para poder recorrer los passengers y mostrar la info para cada uno
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
        this.error = 'No se ha podido cargar la informaciÃ³n del vuelo.';
        this.isLoadingFlight = false;
      },
    });
  }

  submit(): void {
    if (!this.flight || this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const { contactEmail, passengers } = this.bookingForm.getRawValue();

    this._bookingService
      .create({
        flightId: this.flight.id,
        passengers: passengers.map((passenger: PassengerForm) => ({
          ...passenger,
          email: contactEmail,
        })),
      })
      .subscribe({
        next: (confirmation) => {
          this._router.navigate(['/confirmation'], { state: { confirmation } });
        },
        error: () => {
          this.error =
            'No se ha podido completar la reserva. IntÃƒÂ©ntalo de nuevo.';
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
    return new FormGroup(
      {
        firstName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(2)],
        }),
        lastName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(2)],
        }),
        documentType: new FormControl<'dni' | 'passport'>('dni', {
          nonNullable: true,
          validators: Validators.required,
        }),
        documentNumber: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      {
        validators: [this.documentValidator()],
      },
    );
  }

  //*validator que mira el tipo de docu y su patron. Usamos el Validatorfn a diferencia de funcion normal porque asi lo podemos usar a nivel de grupo y no de control individual, ya que necesitamos validar 2 controles a la vez (tipo y numero)
  //*abstract control es el tipo generico que puede ser un formcontrol, formgroup o formarray, y validationerrors es un objeto con los errores o null si no hay errores
  //*en validacinoes custom podemos asociar cadaerror a un nombre y a un mensaje
  private documentValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const type = group.get('documentType')?.value;
      const number = group.get('documentNumber')?.value;

      if (!number) return null;

      const dniRegex = /^[0-9]{8}[A-Z]$/;
      const passportRegex = /^[A-Z0-9]{6,9}$/;

      //*estamos devolviendo el nombre del error y este se asocia a un mensaje
      if (type === 'dni' && !dniRegex.test(number.toUpperCase())) {
        return { invalidDocument: 'El DNI debe tener 8 números y 1 letra.' };
      }

      if (type === 'passport' && !passportRegex.test(number.toUpperCase())) {
        return {
          invalidDocument:
            'El pasaporte debe ser alfanumérico y tener entre 6 y 9 caracteres.',
        };
        //!esto es lo que le pasaba inicialmente y luego en el html lo gestiono
        //! if (type === 'passport' && !passportRegex.test(number.toUpperCase())) {
        //!return { invalidPassport: true };
        //!}
      }

      return null;
    };
  }
}
