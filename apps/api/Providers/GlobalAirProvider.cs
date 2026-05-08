using Api.Models;

namespace Api.Providers
{
    public class GlobalAirProvider : IFlightProvider
    {
        public string Name => "GlobalAir";

        public async Task<List<Flight>> SearchFlightsAsync(string origin, string destination)
        {
            var baseFare = 200m;
            var finalPrice = Math.Round(baseFare * 1.15m, 2); // Rule: +15%

            return new List<Flight>
            {
                new Flight {
                    ProviderName = Name,
                    FlightNumber = "GA-123",
                    Origin = origin,
                    Destination = destination,
                    BaseFare = baseFare,
                    FinalPrice = finalPrice
                }
            };
        }
    }
}
