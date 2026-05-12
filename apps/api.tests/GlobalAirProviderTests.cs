using Api.Providers;

namespace api.tests
{
    public class GlobalAirProviderTests
    {
        [Fact]
        public async Task SearchFlights_ShouldApply15PercentSurchargeAndRoundCorrectly()
        {
            // Arrange
            var provider = new GlobalAirProvider();
            var departureDate = DateTime.Now;
            int passengers = 2;

            // Act
            var results = await provider.SearchFlightsAsync("LHR", "JFK", departureDate, passengers, "Economy");

            // Assert
            var flight = results[0];

            // if BaseFare in mock is 200:
            // 200 * 1.15 = 230.00
            decimal expectedPricePerPassenger = 230.00m;
            decimal expectedTotalPrice = expectedPricePerPassenger * passengers;

            Assert.Equal(expectedPricePerPassenger, flight.PricePerPassenger);
            Assert.Equal(expectedTotalPrice, flight.TotalPrice);

            // Round Verification
            Assert.Equal(flight.PricePerPassenger, Math.Round(flight.PricePerPassenger, 2));
        }
    }
}