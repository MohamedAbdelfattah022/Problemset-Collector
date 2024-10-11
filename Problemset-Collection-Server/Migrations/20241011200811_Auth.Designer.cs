﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Problemset_Collection_Server.Data;

#nullable disable

namespace Problemset_Collection_Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20241011200811_Auth")]
    partial class Auth
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Problemset_Collection_Server.Data.Platform", b =>
                {
                    b.Property<int>("PlatformId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PlatformId"));

                    b.Property<string>("PlatformName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PlatformUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("PlatformId");

                    b.ToTable("Platforms");
                });

            modelBuilder.Entity("Problemset_Collection_Server.Data.Problem", b =>
                {
                    b.Property<int>("ProblemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProblemId"));

                    b.Property<int>("PlatformId")
                        .HasColumnType("int");

                    b.Property<string>("ProblemDifficulty")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProblemName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProblemUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ProblemId");

                    b.ToTable("Problems");
                });

            modelBuilder.Entity("Problemset_Collection_Server.Data.ProblemTag", b =>
                {
                    b.Property<int>("ProblemId")
                        .HasColumnType("int");

                    b.Property<int>("TagId")
                        .HasColumnType("int");

                    b.HasKey("ProblemId", "TagId");

                    b.ToTable("ProblemTags");
                });

            modelBuilder.Entity("Problemset_Collection_Server.Data.Tag", b =>
                {
                    b.Property<int>("TagId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TagId"));

                    b.Property<string>("TagName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TagId");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("Problemset_Collection_Server.Data.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
