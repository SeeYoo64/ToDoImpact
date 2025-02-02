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

        // Configure the relationship between User and TodoTask
        modelBuilder.Entity<TodoTask>()
            .HasOne(t => t.User)             // A TodoTask has one User
            .WithMany(u => u.Tasks)          // A User can have many TodoTasks
            .HasForeignKey(t => t.UserId)    // The foreign key is UserId in TodoTask
            .OnDelete(DeleteBehavior.Cascade); // You can specify the delete behavior if necessary
    }

}