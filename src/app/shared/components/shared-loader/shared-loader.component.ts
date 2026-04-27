import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-shared-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './shared-loader.component.html',
  styleUrl: './shared-loader.component.scss',
})
export class SharedLoaderComponent {
  message = input('Cargando...');
  diameter = input(48);
}
