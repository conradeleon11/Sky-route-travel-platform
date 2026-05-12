import { Component, inject, signal } from '@angular/core';
import { FlightService } from './services/flight';
import { FlightSearchResponse } from './models/flight.model';
import { CommonModule } from '@angular/common';
import { BookingRequest } from './models/flight.model';
import { delay, finalize } from 'rxjs/operators';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';
import { FlightResultsComponent } from './components/flight-results/flight-results.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FlightSearchComponent, FlightResultsComponent, BookingFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private flightService = inject(FlightService);
  selectedFlight: FlightSearchResponse | null = null;
  flights = signal<FlightSearchResponse[]>([]);
  loading = signal<boolean>(false);
  isBooking = signal<boolean>(false);
  bookingStatus = signal<string | null>(null);
  searchPerformed = signal<boolean>(false);

  lastSearchParams: any = null;

  airports = [
    { code: 'EZE', name: 'Ezeiza, Buenos Aires (ARG)' },
    { code: 'AEP', name: 'Aeroparque, Buenos Aires (ARG)' },
    { code: 'COR', name: 'Pajas Blancas, Córdoba (ARG)' },
    { code: 'MEX', name: 'Benito Juárez, Ciudad de México (MEX)' },
    { code: 'CUN', name: 'Cancún International (MEX)' },
    { code: 'GDL', name: 'Miguel Hidalgo, Guadalajara (MEX)' }
  ];

  airportCountryMap: { [key: string]: string } = {
    'EZE': 'ARG', 'AEP': 'ARG', 'COR': 'ARG',
    'MEX': 'MEX', 'CUN': 'MEX', 'GDL': 'MEX'
  };

  get isInternational(): boolean {
    if (!this.lastSearchParams || !this.selectedFlight) return false;

    const origin = this.lastSearchParams.origin;
    const destination = this.lastSearchParams.destination;

    const originCountry = this.airportCountryMap[origin];
    const destCountry = this.airportCountryMap[destination];

    return originCountry !== destCountry;
  }

 onSearch(formData: any) {
    this.lastSearchParams = formData;
    this.searchPerformed.set(true);
    this.loading.set(true);
    this.flights.set([]);
    this.bookingStatus.set(null);

    this.flightService.searchFlights(
      formData.origin,
      formData.destination,
      formData.departureDate,
      formData.passengers,
      formData.cabinClass
    ).pipe(
      delay(800),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => {
        console.log('Resultados de API:', data);
        this.flights.set(data);
      },
      error: (err) => console.error('Error en API:', err)
    });
  }

  onSort(criteria: string) {
    const sorted = [...this.flights()]; // Copia del array
    
    if (criteria === 'price') {
      sorted.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (criteria === 'duration') {
      sorted.sort((a, b) => a.duration.localeCompare(b.duration));
    } else if (criteria === 'departure') {
      sorted.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
    }
    
    this.flights.set(sorted);
  }

  onBook(flight: FlightSearchResponse) {
    this.selectedFlight = flight;
    this.isBooking.set(true);
    this.bookingStatus.set(null);
  }

  confirmBooking(passengerData: any) {
    if (!this.selectedFlight) return;

    this.loading.set(true);
    this.bookingStatus.set(null);

    const request: BookingRequest = {
      flightNumber: this.selectedFlight.flightNumber,
      providerName: this.selectedFlight.providerName,
      fullName: passengerData.fullName,
      email: passengerData.email,
      documentNumber: passengerData.documentNumber
    };

    this.flightService.bookFlight(request)
    .pipe(
      delay(800),
      finalize(() => this.loading.set(false))
    )
    .subscribe({
      next: (res) => {
        this.bookingStatus.set(`Success! Ref: ${res.bookingReference}`);
        this.isBooking.set(false);
        this.flights.set([]);

        this.selectedFlight = null;
        setTimeout(() => this.bookingStatus.set(null), 5000);
      },
      error: (err) => {
        console.error('Booking error', err);
        this.bookingStatus.set('Error processing your booking.');
        this.loading.set(false);
      }
    });
  }

  cancelBooking() {
    this.isBooking.set(false);
    this.selectedFlight = null;
  }
}