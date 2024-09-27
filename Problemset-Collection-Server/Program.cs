using Problemset_Collection_Server.Data;

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

            builder.Services.AddCors(options => {
                options.AddPolicy("AllowAll", policy => policy.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());
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
