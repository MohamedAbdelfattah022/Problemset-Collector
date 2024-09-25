using Microsoft.EntityFrameworkCore;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            //var constr = configuration.GetSection("constr").Value;

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //builder.Services.AddDbContext<AppDbContext>(builder => builder.UseSqlServer(constr));
            builder.Services.AddDbContext<AppDbContext>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
