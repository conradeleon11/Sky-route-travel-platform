using Api.Models;

namespace Api.Providers
{
    public class BudgetWingsProvider : IFlightProvider
    {
        public string Name => "BudgetWings";

        public async Task<List<FlightSearchResponse>> SearchFlightsAsync(
            string origin,
            string destination,
            DateTime departureDate,
            int passengers,
            string cabinClass)
        {
            decimal baseFare = cabinClass switch
            {
                "First Class" => 250m,
                "Business" => 120m,
                _ => 50m // Economy
            };

            // Rule: -10% minimum $29.99
            decimal discountedPrice = baseFare * 0.90m;
            var pricePerPassenger = Math.Max(discountedPrice, 29.99m);

            return new List<FlightSearchResponse>
            {
                new FlightSearchResponse
                {
                    ProviderName = Name,
                    FlightNumber = "BW-502",
                    DepartureTime = departureDate.AddHours(14),
                    ArrivalTime = departureDate.AddHours(17).AddMinutes(45),
                    Duration = "3h 45m",
                    CabinClass = cabinClass,
                    PricePerPassenger = pricePerPassenger,
                    TotalPrice = Math.Round(pricePerPassenger * passengers, 2)
                }
            };
        }
    }
}