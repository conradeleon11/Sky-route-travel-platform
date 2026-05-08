using Api.Models;
using Api.Providers;

namespace Api.Services
{
    public class FlightService
    {
        private readonly IEnumerable<IFlightProvider> _providers;

        public FlightService(IEnumerable<IFlightProvider> providers)
        {
            _providers = providers;
        }

        public async Task<List<Flight>> GetAllFlights(string origin, string destination)
        {
            var tasks = _providers.Select(p => p.SearchFlightsAsync(origin, destination));
            var results = await Task.WhenAll(tasks);

            return results.SelectMany(f => f).OrderBy(f => f.FinalPrice).ToList();
        }
    }
}
