using Microsoft.AspNetCore.Mvc;
using ToDoImpact.Dtos;
using ToDoImpact.Services;

namespace ToDoImpact.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResult>> Register(RegisterDto registerDto)
    {
        var authResult = await _authService.Register(registerDto);
        if (!authResult.Success)
        {
            return BadRequest(authResult);
        }

        return Ok(authResult);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResult>> Login(LoginDto loginDto)
    {
        var authResult = await _authService.Login(loginDto);
        if (!authResult.Success)
        {
            return Unauthorized(authResult);
        }

        return Ok(authResult);
    }
}