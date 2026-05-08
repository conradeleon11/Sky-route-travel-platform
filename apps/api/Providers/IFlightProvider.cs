using Api.Models;

namespace Api.Providers
{
    public interface IFlightProvider
    {
        string Name { get; }
        Task<List<Flight>> SearchFlightsAsync(string origin, string destination);
    }
}