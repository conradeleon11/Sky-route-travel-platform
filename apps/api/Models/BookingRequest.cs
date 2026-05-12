namespace Api.Models
{
    public class BookingRequest
    {
        // Flight
        public string FlightNumber { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;

        // Passenger
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DocumentNumber { get; set; } = string.Empty;
    }
}
