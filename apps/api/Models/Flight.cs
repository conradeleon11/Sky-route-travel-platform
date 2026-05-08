namespace Api.Models
{
    public class Flight
    {
        public string ProviderName { get; set; } = string.Empty;
        public string FlightNumber { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public decimal BaseFare { get; set; }
        public decimal FinalPrice { get; set; }
        public DateTime DepartureTime { get; set; }
    }
}