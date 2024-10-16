using Microsoft.EntityFrameworkCore;
using Problemset_Collection_Server.Data;
using System.Net;
using System.Net.Mail;

namespace Problemset_Collection_Server.Services
{
    public class EmailService(SMTPSettings smtpSettings, AppDbContext dbContext)
    {
        public async Task SendAdminInvitationService(string recipientEmail, string passwordSetupLink) {
            var body =
            $@"
                <p>You have been invited to join the <strong>Problemset Collector</strong> as an administrator. Please use the link below to set up your password and complete your registration:</p>
                <p><a href='{passwordSetupLink}'>{passwordSetupLink}</a></p>
                <p>If you did not request this invitation, please ignore this email.</p>
                <p>Best regards,<br/>Problemset Collector Team</p>
            ";

            using (var client = new SmtpClient(smtpSettings.Server, smtpSettings.Port)) {
                client.Credentials = new NetworkCredential(smtpSettings.SenderEmail, smtpSettings.Password);
                client.EnableSsl = true;

                var mailMessage = new MailMessage {
                    From = new MailAddress(smtpSettings.SenderEmail),
                    Subject = "Invitation to Set Up Your Admin Account",
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(new MailAddress(recipientEmail));
                await client.SendMailAsync(mailMessage);
            }
        }

        public async Task<bool> VerifyTokenService(string token) {
            var existingToken = await dbContext.AdminInvitations.FirstOrDefaultAsync(i => i.Token == token);
            if (existingToken == null || existingToken.Expiration < DateTime.UtcNow) return false;

            return true;
        }
    }
}