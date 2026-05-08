using Api.Models;
using Api.Providers;
using Api.Services;
using Moq;

namespace api.tests
{
    public class FlightServiceTests
    {
        [Fact]
        public async Task GetAllFlights_ShouldReturnOrderedResults()
        {
            // Arrange
            var mockProvider = new Mock<IFlightProvider>();

            // Mocking provider return $100 flight
            mockProvider.Setup(p => p.SearchFlightsAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<int>(), It.IsAny<string>()))
                .ReturnsAsync(new List<FlightSearchResponse> {
                    new FlightSearchResponse { TotalPrice = 100m, ProviderName = "MockAir" }
                });

            // Inject mock into the Service
            var service = new FlightService(new List<IFlightProvider> { mockProvider.Object });

            // Act
            var results = await service.GetAllFlights("A", "B", DateTime.Now, 1, "Economy");

            // Assert
            Assert.Single(results);
            Assert.Equal(100m, results[0].TotalPrice);
            mockProvider.Verify(p => p.SearchFlightsAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<int>(), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task CreateBooking_ShouldReturnValidReference_WhenDataIsCorrect()
        {
            // Arrange
            var service = new FlightService(Enumerable.Empty<IFlightProvider>());
            var request = new BookingRequest
            {
                FullName = "Conrado Test",
                Email = "test@example.com",
                DocumentNumber = "12345678"
            };

            // Act
            var result = await service.CreateBooking(request);

            // Assert
            Assert.NotNull(result);
            Assert.StartsWith("SK-", result.BookingReference);
            Assert.Equal("Confirmed", result.Status);
            Assert.True(result.BookingReference.Length > 3);
        }
    }
}