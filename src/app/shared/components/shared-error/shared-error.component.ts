import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shared-error',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './shared-error.component.html',
  styleUrl: './shared-error.component.scss',
})
export class SharedErrorComponent {
  message = input.required<string>();
  icon = input('error_outline');
  actionLabel = input('Reintentar');
  action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
