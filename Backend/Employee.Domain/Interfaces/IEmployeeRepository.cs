using EmployeeEntity = Employee.Domain.Entities.Employee;

namespace Employee.Domain.Interfaces;

public interface IEmployeeRepository
{
    Task<IEnumerable<EmployeeEntity>> GetAllAsync();
    Task<EmployeeEntity?> GetByIdAsync(int id);
    Task<EmployeeEntity> AddAsync(EmployeeEntity employee);
    Task UpdateAsync(EmployeeEntity employee);
    Task DeleteAsync(int id);
}
