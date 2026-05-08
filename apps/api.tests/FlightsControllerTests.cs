using Api.Controllers;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace api.tests
{
    public class FlightsControllerTests
    {
        private readonly Mock<IFlightService> _mockService;
        private readonly FlightsController _controller;

        public FlightsControllerTests()
        {
            _mockService = new Mock<IFlightService>();
            _controller = new FlightsController(_mockService.Object);
        }

        [Fact]
        public async Task BookFlight_ReturnsOk_WhenRequestIsValid()
        {
            // Arrange
            var request = new BookingRequest { FullName = "John Doe", Email = "john@test.com" };
            _mockService.Setup(s => s.CreateBooking(It.IsAny<BookingRequest>()))
                        .ReturnsAsync(new BookingResponse { BookingReference = "SK-TEST", Status = "Confirmed" });

            // Act
            var result = await _controller.BookFlight(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<BookingResponse>(okResult.Value);
            Assert.Equal("SK-TEST", response.BookingReference);
        }

        [Fact]
        public async Task BookFlight_ReturnsBadRequest_WhenFullNameIsEmpty()
        {
            // Arrange
            var request = new BookingRequest { FullName = "", Email = "john@test.com" };

            // Act
            var result = await _controller.BookFlight(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }
    }
}