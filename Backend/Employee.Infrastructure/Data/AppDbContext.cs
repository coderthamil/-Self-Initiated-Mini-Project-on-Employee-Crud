using EmployeeEntity = Employee.Domain.Entities.Employee;
using Employee.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Employee.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<EmployeeEntity> Employees => Set<EmployeeEntity>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<EmployeeEntity>().HasData(
            new EmployeeEntity { Id = 1, Name = "Alice Johnson", Department = "Engineering", Designation = "Senior Developer", Salary = 85000, Phone = "+1-555-0101", Email = "alice.j@example.com" },
            new EmployeeEntity { Id = 2, Name = "Bob Smith", Department = "Human Resources", Designation = "HR Manager", Salary = 65000, Phone = "+1-555-0102", Email = "bob.s@example.com" },
            new EmployeeEntity { Id = 3, Name = "Carol White", Department = "Design", Designation = "UI/UX Designer", Salary = 72000, Phone = "+1-555-0103", Email = "carol.w@example.com" }
        );
    }
}
