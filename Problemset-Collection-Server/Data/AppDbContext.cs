﻿using Microsoft.EntityFrameworkCore;

namespace Problemset_Collection_Server.Data
{
    public class AppDbContext : DbContext
    {        
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Platform> Platforms { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ProblemTag> ProblemTags { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var constr = configuration.GetSection("constr").Value;

            optionsBuilder.UseSqlServer(constr);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ProblemTag>()
                .HasKey(pt => new { pt.ProblemId, pt.TagId });
        }
    }
}