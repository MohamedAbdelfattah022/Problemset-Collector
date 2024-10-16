using dotenv.net;
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

            DotEnv.Load();
            builder.Configuration.AddEnvironmentVariables();

            // JWT Config
            builder.Configuration["Jwt:Issuer"] = Environment.GetEnvironmentVariable("Issuer");
            builder.Configuration["Jwt:Audience"] = Environment.GetEnvironmentVariable("Audience");
            builder.Configuration["Jwt:DurationInMin"] = Environment.GetEnvironmentVariable("DurationInMin");
            builder.Configuration["Jwt:SigningKey"] = Environment.GetEnvironmentVariable("SigningKey");

            // Email Config
            builder.Configuration["SMTP:Server"] = Environment.GetEnvironmentVariable("Server");
            builder.Configuration["SMTP:Port"] = Environment.GetEnvironmentVariable("Port");
            builder.Configuration["SMTP:Sender"] = Environment.GetEnvironmentVariable("Sender");
            builder.Configuration["SMTP:SenderEmail"] = Environment.GetEnvironmentVariable("SenderEmail");
            builder.Configuration["SMTP:Password"] = Environment.GetEnvironmentVariable("Password");

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<AppDbContext>();
            builder.Services.AddScoped<ProblemService>();
            builder.Services.AddScoped<EmailService>();

            builder.Services.AddCors(options => {
                options.AddPolicy("AllowAll", policy => policy.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
            });

            var smtpSettengs = builder.Configuration.GetSection("SMTP").Get<SMTPSettings>();
            builder.Services.AddSingleton(smtpSettengs);

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

                Console.WriteLine($"Connection String: {builder.Configuration["constr"]}");
                Console.WriteLine(smtpSettengs.Server);
                Console.WriteLine(smtpSettengs.Sender);
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
