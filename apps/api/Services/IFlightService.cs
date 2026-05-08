using Api.Models;

namespace Api.Services
{
    public interface IFlightService
    {
        Task<List<FlightSearchResponse>> GetAllFlights(
            string origin,
            string destination,
            DateTime departureDate,
            int passengers,
            string cabinClass);

        Task<BookingResponse> CreateBooking(BookingRequest request);
    }
}