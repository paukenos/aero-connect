import { Component, input } from '@angular/core';
import { Flight } from '../../../core/models/flight.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlightCardComponent } from '../flight-card/flight-card.component';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, FlightCardComponent],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.scss',
})
export class FlightListComponent {
  filteredFlights = input.required<Flight[]>();
}
