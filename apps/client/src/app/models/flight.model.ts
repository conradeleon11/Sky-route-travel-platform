export interface FlightSearchResponse {
  providerName: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  cabinClass: string;
  pricePerPassenger: number;
  totalPrice: number;
}

export interface BookingRequest {
  flightNumber: string;
  providerName: string;
  fullName: string;
  email: string;
  documentNumber: string;
}

export interface BookingResponse {
  bookingReference: string;
  bookingDate: string;
  status: string;
}