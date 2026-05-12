using Api.Models;

namespace Api.Providers
{
    public interface IFlightProvider
    {
        string Name { get; }
        Task<List<FlightSearchResponse>> SearchFlightsAsync(
            string origin,
            string destination,
            DateTime departureDate,
            int passengers,
            string cabinClass);
    }
}

