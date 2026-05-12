import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService } from './services/flight';
import { FlightSearchResponse } from './models/flight.model';
import { CommonModule } from '@angular/common';
import { BookingRequest } from './models/flight.model';
import { delay, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);
  selectedFlight: FlightSearchResponse | null = null;
  flights = signal<FlightSearchResponse[]>([]);
  loading = signal<boolean>(false);
  isBooking = signal<boolean>(false);
  bookingStatus = signal<string | null>(null);
  searchPerformed = signal<boolean>(false);

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
    if (!this.selectedFlight || !this.searchForm.value.origin || !this.searchForm.value.destination) return false;
    
    const originCountry = this.airportCountryMap[this.searchForm.value.origin];
    const destCountry = this.airportCountryMap[this.searchForm.value.destination];
    
    return originCountry !== destCountry;
  }

  searchForm = this.fb.group({
    origin: ['', [Validators.required, Validators.minLength(3)]],
    destination: ['', [Validators.required, Validators.minLength(3)]],
    departureDate: ['', Validators.required],
    passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
    cabinClass: ['Economy', Validators.required]
  });

  bookingForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    documentNumber: ['', Validators.required]
  });

  onSearch() {
    if (this.searchForm.invalid) return;

    this.searchPerformed.set(true);
    this.loading.set(true);
    this.flights.set([]);
    this.bookingStatus.set(null);

    const val = this.searchForm.value;

    this.flightService.searchFlights(
      val.origin!,
      val.destination!,
      val.departureDate!,
      val.passengers!,
      val.cabinClass!
    ).pipe(
      delay(800),
      finalize(() => this.loading.set(false))
    )
      .subscribe({
        next: (data) => {
          console.log('Data received:', data);
          this.flights.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Search failed:', err);
          alert('Error fetching flights. Is the backend running?');
          this.loading.set(false);
        }
      });
  }

  onSort(criteria: string) {
    const sorted = [...this.flights()]; // Copia del array
    
    if (criteria === 'price') {
      sorted.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (criteria === 'duration') {
      // Esto asume que duration viene como "3h 45m". 
      // Para simplificar, ordenamos por el string o puedes parsearlo.
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
    
    const docControl = this.bookingForm.get('documentNumber');
    docControl?.reset();

    if (this.isInternational) {
      // Passport validation alphanumeric
      docControl?.setValidators([Validators.required, Validators.pattern('^[A-Z0-9]{6,12}$')]);
    } else {
      // National flights validation ID
      docControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{7,10}$')]);
    }
    
    docControl?.updateValueAndValidity();
  }

  confirmBooking() {
    if (this.bookingForm.invalid || !this.selectedFlight) return;

    this.loading.set(true);
    this.bookingStatus.set(null);

    const request: BookingRequest = {
      flightNumber: this.selectedFlight.flightNumber,
      providerName: this.selectedFlight.providerName,
      fullName: this.bookingForm.value.fullName!,
      email: this.bookingForm.value.email!,
      documentNumber: this.bookingForm.value.documentNumber!
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
        this.loading.set(false);
        this.flights.set([]);

        this.bookingForm.reset();
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
    this.bookingForm.reset();
  }
}