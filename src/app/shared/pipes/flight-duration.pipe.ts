import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flightDuration',
  standalone: true,
})
// pipe para transformar la duración del vuelo a hora + minutos
export class FlightDurationPipe implements PipeTransform {
  transform(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }
}
