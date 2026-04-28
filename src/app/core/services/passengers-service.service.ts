import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PassengerProfile } from '../models/passengers.model';

@Injectable({ providedIn: 'root' })
export class PassengerService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/passengers`;

  getAll(): Observable<PassengerProfile[]> {
    return this.http.get<PassengerProfile[]>(this.base);
  }

  getById(id: string): Observable<PassengerProfile> {
    return this.http.get<PassengerProfile>(`${this.base}/${id}`);
  }

  update(
    id: string,
    data: Partial<PassengerProfile>,
  ): Observable<PassengerProfile> {
    return this.http.put<PassengerProfile>(`${this.base}/${id}`, data);
  }

  create(
    data: Omit<PassengerProfile, 'id' | 'totalFlights'>,
  ): Observable<PassengerProfile> {
    return this.http.post<PassengerProfile>(this.base, data);
  }
}