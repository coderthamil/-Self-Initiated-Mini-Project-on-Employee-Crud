using Employee.Application.DTOs;

namespace Employee.Application.Interfaces;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeDto>> GetAllAsync();
    Task<EmployeeDto?> GetByIdAsync(int id);
    Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
    Task UpdateAsync(UpdateEmployeeDto dto);
    Task DeleteAsync(int id);
}