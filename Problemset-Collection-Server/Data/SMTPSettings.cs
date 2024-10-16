namespace Problemset_Collection_Server.Data
{
    public class SMTPSettings
    {
        public string Server { get; set; }
        public int Port { get; set; }
        public string Sender { get; set; }
        public string SenderEmail { get; set; }
        public string Password { get; set; }
    }
}
