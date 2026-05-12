import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService } from './services/flight';
import { FlightSearchResponse } from './models/flight.model';
import { CommonModule } from '@angular/common';
import { BookingRequest } from './models/flight.model';

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
    ).subscribe({
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

  onBook(flight: FlightSearchResponse) {
    this.selectedFlight = flight;
    this.isBooking.set(true);
    this.bookingStatus.set(null);
  }
  confirmBooking() {
    if (this.bookingForm.invalid || !this.selectedFlight) return;

    this.loading.set(true);

    const request: BookingRequest = {
      flightNumber: this.selectedFlight.flightNumber,
      providerName: this.selectedFlight.providerName,
      fullName: this.bookingForm.value.fullName!,
      email: this.bookingForm.value.email!,
      documentNumber: this.bookingForm.value.documentNumber!
    };

    this.flightService.bookFlight(request).subscribe({
      next: (res) => {
        this.bookingStatus.set(`Success! Ref: ${res.bookingReference}`);
        this.isBooking.set(false);
        this.loading.set(false);
        this.flights.set([]);

        this.bookingForm.reset();
        this.selectedFlight = null;
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