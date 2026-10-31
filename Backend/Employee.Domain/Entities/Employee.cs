namespace Employee.Domain.Entities;

public class Employee   
{
     public int Id { get; set; }                     // Auto-generated
    public string Name { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
