import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlightSearchResponse, BookingRequest, BookingResponse } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/flights';

  searchFlights(
    origin: string,
    destination: string,
    departureDate: string,
    passengers: number,
    cabinClass: string
  ): Observable<FlightSearchResponse[]> {
    // Set up query parameters
    const params = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('departureDate', departureDate)
      .set('passengers', passengers.toString())
      .set('cabinClass', cabinClass);

    return this.http.get<FlightSearchResponse[]>(`${this.apiUrl}/search`, { params });
  }

  bookFlight(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/book`, request);
  }
}