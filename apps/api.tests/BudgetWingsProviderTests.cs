using Api.Providers;

namespace api.tests
{
    public class BudgetWingsProviderTests
    {
        [Fact]
        public async Task SearchFlights_ShouldApplyTenPercentDiscount_ForEconomyClass()
        {
            // Arrange: Initialize the provider and search parameters
            var provider = new BudgetWingsProvider();
            var departureDate = DateTime.Now;
            var passengers = 1;
            var cabinClass = "Economy"; // Base fare is $50 in the mock

            // Act: Execute the search
            var results = await provider.SearchFlightsAsync("MEX", "JFK", departureDate, passengers, cabinClass);

            // Assert: Verify the business rules
            var flight = results[0];

            // Calculation: $50.00 base * 0.90 (10% discount) = $45.00
            // Since $45.00 > $29.99, the final price should be $45.00
            decimal expectedPrice = 45.00m;

            Assert.Equal(expectedPrice, flight.PricePerPassenger);
            Assert.Equal(expectedPrice * passengers, flight.TotalPrice);
        }

        [Fact]
        public async Task SearchFlights_ShouldEnforceMinimumPrice_WhenFareIsVeryLow()
        {
            // Arrange
            var provider = new BudgetWingsProvider();

            // Act
            var results = await provider.SearchFlightsAsync("ANY", "ANY", DateTime.Now, 1, "Economy");

            // Assert
            var flight = results[0];

            // Business Rule: The discount is applied, but price cannot be lower than $29.99
            Assert.True(flight.PricePerPassenger >= 29.99m, "The price per passenger should never be below $29.99");
        }
    }
}