using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Problemset_Collection_Server.Data;
using Problemset_Collection_Server.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Problemset_Collection_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(JwtOptions jwtOptions, AppDbContext dbContext) : ControllerBase
    {

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(User user) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null) return Conflict("Email already registered.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            await dbContext.Users.AddAsync(user);
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
    }
}
