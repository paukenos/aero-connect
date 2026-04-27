import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

//el service de navegació després l'importo a search-results i al header i així no depenen directament de Router i podem canviar la navegació des d'un sol lloc
@Injectable({ providedIn: 'root' })
export class NavegacionService {
  private _router = inject(Router);

  goBack(): void {
    this._router.navigate(['/']);
  }
}
