namespace Api.Models
{
    public class FlightSearchResponse
    {
        public string ProviderName { get; set; } = string.Empty;
        public string FlightNumber { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string Duration { get; set; } = string.Empty;
        public string CabinClass { get; set; } = string.Empty;
        public decimal PricePerPassenger { get; set; }
        public decimal TotalPrice { get; set; }
    }
}