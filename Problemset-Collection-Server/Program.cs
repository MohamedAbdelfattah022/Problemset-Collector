using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Problemset_Collection_Server.Data;
using Problemset_Collection_Server.Services;
using System.Text;

namespace Problemset_Collection_Server
{
    public class Program
    {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<AppDbContext>();
            builder.Services.AddScoped<ProblemService>();

            builder.Services.AddCors(options => {
                options.AddPolicy("AllowAll", policy => policy.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
            });

            var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>();
            builder.Services.AddSingleton(jwtOptions);

            builder.Services.AddAuthentication()
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => {
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuer = true,
                        ValidIssuer = jwtOptions.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtOptions.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
