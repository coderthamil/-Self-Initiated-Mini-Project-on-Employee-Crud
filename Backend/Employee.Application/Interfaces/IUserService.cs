using Employee.Application.DTOs;

namespace Employee.Application.Interfaces;

public interface IUserService
{
    Task<AuthResponseDTO> RegisterAsync(RegisterDTO dto);
    Task<AuthResponseDTO> LoginAsync(LoginDTO dto);
}