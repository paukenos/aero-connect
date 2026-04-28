import { Passenger } from './../../core/models/booking.model';
import { Injectable, computed, inject, signal } from '@angular/core';
import { PassengerService } from '../../core/services/passengers-service.service';
import { PassengerProfile } from '../../core/models/passengers.model';
import { catchError, finalize, Observable, of, take, tap } from 'rxjs';

/**
 * Facade de PassengerBook — versión imperativa
 *
 * Responsabilidades:
 *  - Coordinar las llamadas HTTP (PassengerService)
 *  - Mantener el estado de la feature
 *  - Exponer una API limpia al componente
 *
 * Problemas de esta implementación que resolveremos con Signals:
 *  1. Estado mutable y público → cualquiera puede escribir en él
 *  2. 'filteredPassengers' es un array duplicado de 'passengers' → pueden desincronizarse
 *  3. La lógica de filtrado tiene que ejecutarse manualmente en dos sitios (loadAll + applyFilter)
 *  4. setTimeout para ocultar el banner de éxito → no es reactivo
 *  5. Ninguna propiedad derivada está memoizada
 */
@Injectable()
export class PassengerBookFacade {
  private readonly passengerService = inject(PassengerService);

  // ── ESTADO ───────────────────────────────────────────────────────────────────
  // Propiedades de clase planas: no hay notificación automática de cambios,
  // Angular los detecta sólo porque usa Zone.js y revisión de árbol completo.

  public passengers = signal<PassengerProfile[]>([]);

  // Array duplicado para la vista filtrada.
  // Hay que mantenerlo sincronizado con 'passengers' manualmente.
  //pillamos lo que pone el user en el input que nos viene del ts y lo guardamos en searchTerm
  public searchTerm = signal('');

  public filteredPassengers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    //filtro vacio = lista completa
    if (!term) {
      return this.passengers();
    }
    //si hay palabrita de busqueda entonces filtramos por todo
    return this.passengers().filter(
      (passenger) =>
        passenger.firstName.toLowerCase().includes(term) ||
        passenger.lastName.toLowerCase().includes(term) ||
        passenger.documentNumber.toLowerCase().includes(term) ||
        passenger.email.toLowerCase().includes(term),
    );
  });

  public selectedPassenger = signal<PassengerProfile | null>(null);

  // true mientras el formulario está en modo "alta" (en lugar de edición)
  public isCreating = signal(false);

  public isLoading = signal(false);
  public isSaving = signal(false);
  public error = signal<string | null>(null);
  public saveSuccess = signal(false);

  // ── ACCIONES ─────────────────────────────────────────────────────────────────

  // loadAll(): void {
  //   this.isLoading.set(true);
  //   this.error.set(null);

  //   //con el take(1) hace solamente una petición + se desuscribe de forma automatic
  //   //esto también lo podriamos solucionar con un resolver
  //   //? esto tambien se podria hacer con el toSignal ->

  //   this.passengerService.getAll().pipe(take(1)).subscribe({
  //     next: (passengers) => {
  //       // Hay que inicializar filteredPassengers también aquí.
  //       // Si lo olvidamos, la lista empieza vacía.
  //       this.passengers.set(passengers);
  //       this.isLoading.set(false);
  //     },
  //     error: () => {
  //       this.error.set('No se pudieron cargar los pasajeros.');
  //       this.isLoading.set(false);
  //     },
  //   });
  // }

  loadAll(): Observable<PassengerProfile[]> {
    this.error.set(null);
    this.isLoading.set(true);
    return this.passengerService.getAll().pipe(
      take(1),
      tap((pass) => this.passengers.set(pass)),
      catchError(() => {
        this.error.set('No se pudieron cargar los pasajeros.');
        return of([]);
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }

  select(passenger: PassengerProfile): void {
    this.selectedPassenger.set(passenger);
    this.isCreating.set(false);
    this.error.set(null);
    this.saveSuccess.set(false);
  }

  applyFilter(term: string): void {
    this.searchTerm.set(term);
    // No necesitamos actualizar 'filteredPassengers' manualmente, porque es una propiedad computada.
  }

  startNew(): void {
    this.selectedPassenger.set(null);
    this.isCreating.set(true);
    this.error.set(null);
    this.saveSuccess.set(false);
  }

  //antes estaba devolviendo void y no contrllaba la suscripcion, ahora devolvemos el observable para que sea el componente quien se suscriba y controle el ciclo de vida
  save(data: Partial<PassengerProfile>): void {
    this.isSaving.set(true);
    this.error.set(null);
    this.saveSuccess.set(false);

    if (this.isCreating()) {
      this._create(data);
    } else {
      this._update(this.selectedPassenger()!.id, data);
    }
  }

  private _update(id: string, data: Partial<PassengerProfile>): void {
    this.passengerService.update(id, data).subscribe({
      next: (updated) => {
        // Actualizar en 'passengers' (fuente de verdad)
        const idx = this.passengers().findIndex((p) => p.id === id);
        //if (idx !== -1) this.passengers = updated;
        //*Hacer esto no tiene mmucho sentido porque llama signal dentro de signal, mejor usar update
        // if (idx !== -1) this.passengers.set([...this.passengers(), updated]);

        if (idx !== -1) {
          this.passengers.update((pass) =>
            pass.map((passenger) => passenger.id === id ? updated : passenger),
          );
        }

        // Actualizar también en 'filteredPassengers' para que la vista no quede desactualizada.
        // Si olvidamos esto, el item de la lista muestra datos viejos.
        // this.filteredPassengers = this.filteredPassengers.map((p) =>
        //   p.id === id ? updated : p,
        // );
        //lo que propone el chatty
        // this.filteredPassengers.update((p) =>
        //   p.map((p) => (p.id === id ? updated : p)),
        // );
        //lo que propone el chatty pero con set
        // this.passengers.set(
        //   this.filteredPassengers().map((p) => (p.id === id ? updated : p)),
        // );

        this.selectedPassenger.set(updated);
        this.isSaving.set(false);
        this.saveSuccess.set(true);

        // Ocultar el banner de éxito tras 3 segundos.
        // setTimeout con Zone.js funciona, pero en OnPush hay que envolverlo en NgZone.run().
        // Con signals, esto se resuelve de otra forma.
        setTimeout(() => {
          this.saveSuccess.set(false);
        }, 3000);
      },
      error: () => {
        this.error.set('No se pudo guardar. Inténtalo de nuevo.');
        this.isSaving.set(false);
      },
    });
  }

  private _create(data: Partial<PassengerProfile>): void {
    this.passengerService
      .create(data as Omit<PassengerProfile, 'id' | 'totalFlights'>)
      .subscribe({
        next: (created) => {
          // Añadir el nuevo pasajero a ambos arrays.
          // Hay que recordar hacerlo en los dos sitios.
          //el ...this.passengers() es para no machacar el array original, sino crear uno nuevo con el nuevo pasajero añadido al final
          //* this.passengers.set([...this.passengers(), created]);
          //no tiene sentido llamar a la señal dentro de la señal, por eso es mejor usar update
          this.passengers.update((pass) => [...pass, created]);

          this.selectedPassenger.set(created);
          this.isCreating.set(false);
          this.isSaving.set(false);
          this.saveSuccess.set(true);

          setTimeout(() => {
            this.saveSuccess.set(false);
          }, 3000);
        },
        error: () => {
          this.error.set('No se pudo crear el pasajero. Inténtalo de nuevo.');
          this.isSaving.set(false);
        },
      });
  }
}
