import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightSearchResponse } from '../../models/flight.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./../../app.component.css']
})
export class BookingFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() flight: FlightSearchResponse | null = null;
  @Input() isInternational: boolean = false;
  @Input() numPassengers: number = 1;
  @Input() loading: boolean = false;
  @Input() origin: string = '';
  @Input() destination: string = '';

  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  bookingForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    documentNumber: ['', Validators.required]
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isInternational'] || changes['flight']) {
      this.updateValidators();
    }
  }

  private updateValidators() {
    const docControl = this.bookingForm.get('documentNumber');
    const pattern = this.isInternational ? '^(?=.*[A-Z])[A-Z0-9]{6,12}$' : '^[0-9]{7,10}$';
    
    docControl?.setValidators([Validators.required, Validators.pattern(pattern)]);
    docControl?.updateValueAndValidity();
  }

  onConfirm() {
    if (this.bookingForm.valid) {
        const rawValue = this.bookingForm.value;
        if (this.isInternational) {
            rawValue.documentNumber = rawValue.documentNumber?.toUpperCase();
        }
        this.confirm.emit(rawValue);
    } else {
    this.bookingForm.markAllAsTouched();
  }
  }

  onCancel() {
    this.bookingForm.reset();
    this.cancel.emit();
  }
}