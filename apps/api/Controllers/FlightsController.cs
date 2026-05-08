using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightsController : ControllerBase
    {
        private readonly FlightService _flightService;

        public FlightsController(FlightService flightService)
        {
            _flightService = flightService;
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<FlightSearchResponse>>> Search(
            [FromQuery] string origin,
            [FromQuery] string destination,
            [FromQuery] DateTime departureDate,
            [FromQuery] int passengers = 1,
            [FromQuery] string cabinClass = "Economy")
        {
            // Validación básica de pasajeros
            if (passengers < 1 || passengers > 9)
            {
                return BadRequest("Number of passengers must be between 1 and 9.");
            }

            var results = await _flightService.GetAllFlights(
                origin, destination, departureDate, passengers, cabinClass);

            return Ok(results);
        }
    }
}