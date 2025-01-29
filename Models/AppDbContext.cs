using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ToDoImpact.Models;

namespace ToDoImpact.Models;
public class AppDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public DbSet<TodoTask> Tasks { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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