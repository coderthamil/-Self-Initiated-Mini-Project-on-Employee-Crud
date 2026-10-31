using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Employee.Application.DTOs;
using Employee.Application.Interfaces;
using Employee.Domain.Entities;
using Employee.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Employee.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public UserService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO dto)
    {
        if (await _userRepository.ExistsAsync(dto.Username, dto.Email))
            throw new InvalidOperationException("Username or Email already exists");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        var created = await _userRepository.AddAsync(user);
        return GenerateAuthResponse(created);
    }

    public async Task<AuthResponseDTO> LoginAsync(LoginDTO dto)
    {
        var user = await _userRepository.GetByUsernameAsync(dto.Username)
            ?? throw new UnauthorizedAccessException("Invalid username or password");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid username or password");

        return GenerateAuthResponse(user);
    }

    private AuthResponseDTO GenerateAuthResponse(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"]!;
        var issuer = jwtSettings["Issuer"]!;
        var audience = jwtSettings["Audience"]!;
        var expiresMinutes = int.Parse(jwtSettings["ExpiresMinutes"] ?? "60");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(expiresMinutes);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new AuthResponseDTO
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Username = user.Username,
            Email = user.Email,
            ExpiresAt = expires
        };
    }
}