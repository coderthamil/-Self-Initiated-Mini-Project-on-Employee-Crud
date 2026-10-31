using Employee.Application.DTOs;
using Employee.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Employee.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService) => _userService = userService;

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDTO dto)
    {
        return BadRequest(new { message = "Public registration is disabled. Use the admin account to log in." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        try
        {
            var result = await _userService.LoginAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}
