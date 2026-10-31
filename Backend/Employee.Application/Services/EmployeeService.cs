using Employee.Application.DTOs;
using Employee.Application.Interfaces;
using EmployeeEntity = Employee.Domain.Entities.Employee;
using Employee.Domain.Interfaces;

namespace Employee.Application.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;

    public EmployeeService(IEmployeeRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
        => (await _repository.GetAllAsync()).Select(MapToDto);

    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        var e = await _repository.GetByIdAsync(id);
        return e == null ? null : MapToDto(e);
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        var entity = new EmployeeEntity
        {
            Name = dto.Name, Department = dto.Department,
            Designation = dto.Designation, Salary = dto.Salary,
            Phone = dto.Phone, Email = dto.Email
        };
        return MapToDto(await _repository.AddAsync(entity));
    }

    public async Task UpdateAsync(UpdateEmployeeDto dto)
    {
        var e = await _repository.GetByIdAsync(dto.Id)
            ?? throw new KeyNotFoundException("Employee not found");

        e.Name = dto.Name; e.Department = dto.Department;
        e.Designation = dto.Designation; e.Salary = dto.Salary;
        e.Phone = dto.Phone; e.Email = dto.Email;

        await _repository.UpdateAsync(e);
    }

    public async Task DeleteAsync(int id) => await _repository.DeleteAsync(id);

    private EmployeeDto MapToDto(EmployeeEntity e) => new()
    {
        Id = e.Id, Name = e.Name, Department = e.Department,
        Designation = e.Designation, Salary = e.Salary,
        Phone = e.Phone, Email = e.Email
    };
}
