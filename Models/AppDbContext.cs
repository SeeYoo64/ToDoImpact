using Microsoft.EntityFrameworkCore;
using ToDoImpact.Models;

namespace ToDoImpact.Models;

public class AppDbContext : DbContext
{
    public DbSet<TodoTask> Tasks { get; set; }
    public DbSet<User> Users { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Настройка первичного ключа для TodoTask
        modelBuilder.Entity<TodoTask>()
            .HasKey(t => t.Id);

        // Настройка связи между User и TodoTask
        modelBuilder.Entity<TodoTask>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId);
    }
}