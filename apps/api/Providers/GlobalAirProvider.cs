using Api.Models;

namespace Api.Providers
{
    public class GlobalAirProvider : IFlightProvider
    {
        public string Name => "GlobalAir";

        public async Task<List<FlightSearchResponse>> SearchFlightsAsync(string origin, string destination, DateTime departureDate, int passengers, string cabinClass)
        {
            var baseFare = 200m;
            decimal pricePerPerson = Math.Round(baseFare * 1.15m, 2);  // Rule: +15% , 2 decimals rounded

            return new List<FlightSearchResponse> {
                new FlightSearchResponse {
                    ProviderName = Name,
                    FlightNumber = "GA-101",
                    DepartureTime = departureDate.AddHours(10),
                    ArrivalTime = departureDate.AddHours(13),
                    Duration = "3h 0m",
                    CabinClass = cabinClass,
                    PricePerPassenger = pricePerPerson,
                    TotalPrice = pricePerPerson * passengers
                }
            };
        }
    }
}