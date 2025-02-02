using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ToDoImpact.Dtos;
using ToDoImpact.Models;

namespace ToDoImpact.Services;

public interface IAuthService
{
    Task<AuthResult> Register(RegisterDto registerDto);
    Task<AuthResult> Login(LoginDto loginDto);
}

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<User> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<AuthResult> Register(RegisterDto registerDto)
    {
        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            return new AuthResult
            {
                Success = false,
                Errors = result.Errors.Select(e => e.Description).ToList()
            };
        }

        return new AuthResult
        {
            Success = true,
            Token = GenerateJwtToken(user)
        };
    }

    public async Task<AuthResult> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return new AuthResult
            {
                Success = false,
                Errors = new List<string> { "Invalid email or password." }
            };
        }

        return new AuthResult
        {
            Success = true,
            Token = GenerateJwtToken(user)
        };
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), 
            new Claim(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(15),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class AuthResult
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public IEnumerable<string>? Errors { get; set; }
}