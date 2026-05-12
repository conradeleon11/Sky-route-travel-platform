import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightService } from './services/flight';
import { FlightSearchResponse } from './models/flight.model';
import { CommonModule } from '@angular/common';

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

  searchForm = this.fb.group({
    origin: ['', [Validators.required, Validators.minLength(3)]],
    destination: ['', [Validators.required, Validators.minLength(3)]],
    departureDate: ['', Validators.required],
    passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
    cabinClass: ['Economy', Validators.required]
  });

  onSearch() {
    if (this.searchForm.invalid) return;

    this.loading.set(true);
    this.flights.set([]);
    
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
    console.log('User selected flight:', flight.flightNumber);
  }
}