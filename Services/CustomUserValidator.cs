using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using ToDoImpact.Models;

namespace ToDoImpact.Services;

public class CustomUserValidator<TUser> : IUserValidator<TUser>
    where TUser : class
{
    private readonly ILogger<CustomUserValidator<TUser>> _logger;

    public CustomUserValidator(ILogger<CustomUserValidator<TUser>> logger)
    {
        _logger = logger;
    }

    public async Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user)
    {
        var errors = new List<IdentityError>();

        if (user is User appUser)
        {
            _logger.LogInformation($"Validating user with Username: {appUser.Username}");

            if (string.IsNullOrEmpty(appUser.Username))
            {
                errors.Add(new IdentityError
                {
                    Code = "UsernameEmpty",
                    Description = "Username is required."
                });
            }
            else if (!IsValidUsername(appUser.Username))
            {
                errors.Add(new IdentityError
                {
                    Code = "UsernameInvalid",
                    Description = "Username contains invalid characters. It can only contain letters, digits, and special characters."
                });
            }
        }

        return errors.Count > 0 ? IdentityResult.Failed(errors.ToArray()) : IdentityResult.Success;
    }

    private bool IsValidUsername(string username)
    {
        // Разрешаем буквы, цифры и специальные символы
        return System.Text.RegularExpressions.Regex.IsMatch(username, @"^[a-zA-Z0-9_\-\.@]+$");
    }
}