using Api.Models;
using Api.Providers;

namespace Api.Services
{
    public class FlightService : IFlightService
    {
        private readonly IEnumerable<IFlightProvider> _providers;

        public FlightService(IEnumerable<IFlightProvider> providers)
        {
            _providers = providers;
        }

        public async Task<List<FlightSearchResponse>> GetAllFlights(
            string origin,
            string destination,
            DateTime departureDate,
            int passengers,
            string cabinClass)
        {
            var tasks = _providers.Select(p =>
                p.SearchFlightsAsync(origin, destination, departureDate, passengers, cabinClass));

            var results = await Task.WhenAll(tasks);

            return results
                .SelectMany(f => f)
                .OrderBy(f => f.TotalPrice)
                .ToList();
        }

        public async Task<BookingResponse> CreateBooking(BookingRequest request)
        {
            // Code (eg: SK-XJ92)
            string reference = $"SK-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";

            return new BookingResponse
            {
                BookingReference = reference,
                BookingDate = DateTime.UtcNow,
                Status = "Confirmed"
            };
        }
    }
}