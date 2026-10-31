using EmployeeEntity = Employee.Domain.Entities.Employee;
using Employee.Domain.Interfaces;
using Employee.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Employee.Infrastructure.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;
    public EmployeeRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<EmployeeEntity>> GetAllAsync()
        => await _context.Employees.ToListAsync();

    public async Task<EmployeeEntity?> GetByIdAsync(int id)
        => await _context.Employees.FindAsync(id);

    public async Task<EmployeeEntity> AddAsync(EmployeeEntity employee)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return employee;
    }

    public async Task UpdateAsync(EmployeeEntity employee)
    {
        _context.Entry(employee).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var e = await _context.Employees.FindAsync(id);
        if (e != null) { _context.Employees.Remove(e); await _context.SaveChangesAsync(); }
    }
}
