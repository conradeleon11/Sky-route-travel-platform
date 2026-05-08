namespace Api.Models
{
    public class BookingResponse
    {
        public string BookingReference { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
