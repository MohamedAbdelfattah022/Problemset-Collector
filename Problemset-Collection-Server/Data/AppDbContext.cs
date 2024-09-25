using Microsoft.EntityFrameworkCore;

namespace Problemset_Collection_Server.Data
{
    public class AppDbContext : DbContext
    {        
        DbSet<Problem> Problems { get; set; }
        DbSet<Platform> Platforms { get; set; }
        DbSet<Tag> Tags { get; set; }
        DbSet<ProblemTag> ProblemTags { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var constr = configuration.GetSection("constr").Value;

            optionsBuilder.UseSqlServer(constr);
        }
    }
}