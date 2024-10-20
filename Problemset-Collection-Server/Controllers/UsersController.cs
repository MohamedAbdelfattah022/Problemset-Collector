﻿using dotenv.net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Problemset_Collection_Server.Data;
using Problemset_Collection_Server.DTO;
using Problemset_Collection_Server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Problemset_Collection_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(JwtOptions jwtOptions, AppDbContext dbContext, EmailService emailService) : ControllerBase
    {

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDto formData) {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!emailService.VerifyTokenService(formData.Token).Result) return BadRequest("Token Invalid");

            var invitation = await dbContext.UserRequests.FirstOrDefaultAsync(i => i.Token == formData.Token);

            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == invitation.Email);
            if (existingUser != null) return Conflict("An error happened");

            User user = new User {
                Email = invitation.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(formData.Password),
            };

            await dbContext.Users.AddAsync(user);
            dbContext.UserRequests.Remove(invitation);
            await dbContext.SaveChangesAsync();

            return Ok("Created Successfully");
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto loginUser) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == loginUser.Email);
            if (user == null) return Unauthorized("Invalid email or password.");

            if (!BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password))
                return Unauthorized("Invalid email or password.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey));

            var tokenDiscriptor = new SecurityTokenDescriptor {
                Issuer = jwtOptions.Issuer,
                Audience = jwtOptions.Audience,
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(new Claim[] {
                    new (ClaimTypes.Email, loginUser.Email),
                    new Claim("TokenId", Guid.NewGuid().ToString()),
                }),
                Expires = DateTime.UtcNow.AddMinutes(jwtOptions.DurationInMin)
            };
            var securityToken = tokenHandler.CreateToken(tokenDiscriptor);
            var accessToken = tokenHandler.WriteToken(securityToken);
            return Ok(accessToken);
        }

        [HttpPost("invite")]
        [Authorize]
        public async Task<ActionResult> InviteUser(EmailDto request) {
            DotEnv.Load();

            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null) return Conflict("Email Already Exists");

            var existingRequest = await dbContext.UserRequests.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingRequest != null) return Conflict("Invitaton Already Sent");

            var invitationToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var expiration = DateTime.UtcNow.AddDays(1);

            var baseUrl = Environment.GetEnvironmentVariable("BaseURL");
            var passwordSetupLink = $"{baseUrl}/setup-password?token={Uri.EscapeDataString(invitationToken)}";

            var invitation = new UserRequest {
                Email = request.Email,
                Token = invitationToken,
                Expiration = expiration
            };

            await dbContext.UserRequests.AddAsync(invitation);
            await emailService.SendUserRequestservice(request.Email, passwordSetupLink);
            await dbContext.SaveChangesAsync();

            return Ok("Invitation Sent");
        }

        [HttpPost("forgotPass")]
        public async Task<ActionResult> ForgotPassword(EmailDto request) {
            DotEnv.Load();
            var baseUrl = Environment.GetEnvironmentVariable("BaseURL");
            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser == null) return NotFound("No such user");

            var existingRequest = await dbContext.UserRequests.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingRequest != null) return Conflict("Request Already Sent");

            var resetToken = Guid.NewGuid().ToString();
            var expiration = DateTime.UtcNow.AddDays(1);

            var passwordResetLink = $"{baseUrl}/reset-password?token={Uri.EscapeDataString(resetToken)}";

            var resetRequest = new UserRequest {
                Email = request.Email,
                Token = resetToken,
                Expiration = expiration
            };

            await dbContext.UserRequests.AddAsync(resetRequest);
            await emailService.ResetPasswordService(request.Email, passwordResetLink);
            await dbContext.SaveChangesAsync();
            return Ok("Reset Email Sent Successfully");
        }

        [HttpPut("resetPass")]
        public async Task<ActionResult> ResetPassword(RegisterDto formData) {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!emailService.VerifyTokenService(formData.Token).Result) return BadRequest("Token Invalid");

            var resetRequest = await dbContext.UserRequests.FirstOrDefaultAsync(r => r.Token == formData.Token);
            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == resetRequest.Email);
            if (existingUser == null) return NotFound();

            existingUser.Email = resetRequest.Email;
            existingUser.Password = BCrypt.Net.BCrypt.HashPassword(formData.Password);

            dbContext.UserRequests.Remove(resetRequest);
            await dbContext.SaveChangesAsync();
            return Ok("Password Updated Successfully");
        }

    }
}
