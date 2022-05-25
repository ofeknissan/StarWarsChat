
using Microsoft.EntityFrameworkCore;
using ChatServer.Models;

namespace ChatServer.Data
{
    public class ChatServerContext : DbContext
    {
        //private const string connectionString = "server=localhost;port=3306;database=Items;user=root;password=123123";

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseMySql(connectionString, MariaDbServerVersion.AutoDetect(connectionString));
        //}

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    // Configuring the Name property as the primary
        //    // key of the Items table
        //    modelBuilder.Entity<Rating>().HasKey(e => e.Id);
        //}


        public ChatServerContext (DbContextOptions<ChatServerContext> options)
            : base(options)
        {
        }
        

        public DbSet<Rating> Rating { get; set; }

        public DbSet<User> User { get; set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<Chat> Chat { get; set; }

        public DbSet<Contact> Contact { get; set; }

    }
}
