import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./../../app.component.css']
})
export class FlightSearchComponent {
  private fb = inject(FormBuilder);

  @Input() airports: any[] = [];
  @Input() loading = false;

  @Output() search = new EventEmitter<any>();

  @Input() set resetTrigger(value: number) {
    if (value > 0) {
      this.searchForm.reset({
        origin: '',
        destination: '',
        departureDate: '',
        passengers: 1,
        cabinClass: 'Economy'
      });
    }
  }

  searchForm = this.fb.group({
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    departureDate: ['', Validators.required],
    passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
    cabinClass: ['Economy', Validators.required]
  });

  onSearch() {
    if (this.searchForm.invalid) return;
    this.search.emit(this.searchForm.value);
  }
}