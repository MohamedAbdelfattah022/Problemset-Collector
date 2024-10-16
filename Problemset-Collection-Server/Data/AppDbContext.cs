using dotenv.net;
using Microsoft.EntityFrameworkCore;

namespace Problemset_Collection_Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Platform> Platforms { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ProblemTag> ProblemTags { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<AdminInvitation> AdminInvitations { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            base.OnConfiguring(optionsBuilder);
            DotEnv.Load();

            var connectionString = Environment.GetEnvironmentVariable("constr");

            optionsBuilder.UseSqlServer(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ProblemTag>()
                .HasKey(pt => new { pt.ProblemId, pt.TagId });
        }
    }
}