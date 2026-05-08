using Api.Models;

namespace Api.Providers
{
    public class BudgetWingsProvider : IFlightProvider
    {
        public string Name => "BudgetWings";

        public async Task<List<Flight>> SearchFlightsAsync(string origin, string destination)
        {
            await Task.Delay(100);

            var baseFare = 40m;
            
            // Rule: -10% minimum $29.99
            var discounted = baseFare * 0.90m;
            var finalPrice = Math.Max(discounted, 29.99m);

            return new List<Flight>
            {
                new Flight {
                    ProviderName = Name,
                    FlightNumber = "BW-999",
                    Origin = origin,
                    Destination = destination,
                    BaseFare = baseFare,
                    FinalPrice = finalPrice
                }
            };
        }
    }
}
