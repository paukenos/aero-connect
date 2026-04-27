import { Component, inject, input } from '@angular/core';
import { Flight } from '../../../core/models/flight.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlightDurationPipe } from '../../pipes/flight-duration.pipe';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    MatIconModule,
    DatePipe,
    CurrencyPipe,
    MatButtonModule,
    FlightDurationPipe,
  ],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
})
export class FlightCardComponent {
  filteredFlights = input.required<Flight[]>();
  private _router = inject(Router);

  bookFlight(flight: Flight): void {
    this._router.navigate(['/booking', flight.id]);
  }
}
