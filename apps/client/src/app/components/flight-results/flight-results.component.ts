import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightSearchResponse } from '../../models/flight.model';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-results.component.html',
  styleUrls: ['./../../app.component.css']
})
export class FlightResultsComponent {
  @Input() flights: FlightSearchResponse[] = [];
  
  @Output() sort = new EventEmitter<string>();
  @Output() book = new EventEmitter<FlightSearchResponse>();

  onSortChange(event: any) {
    this.sort.emit(event.target.value);
  }

  onBookClick(flight: FlightSearchResponse) {
    this.book.emit(flight);
  }
}