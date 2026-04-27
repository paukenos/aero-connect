import { Component, output, input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SearchParams } from '../../../core/models/flight.model';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NavegacionService } from '../../../core/services/navegacion.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, DatePipe, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  // Recibimos los parámetros de búsqueda para mostrar la información en el header
  searchParams = input.required<SearchParams>();
  private _navegacionService = inject(NavegacionService);


  //pasamos el goback como output para que lo gestione el padre (SearchResultsComponent) y así no acoplar el header a la navegación concreta de SearchResultsComponent
  goBack(): void {
    this._navegacionService.goBack();
  }
}
