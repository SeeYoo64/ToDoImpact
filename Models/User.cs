using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace ToDoImpact.Models;
public class User : IdentityUser<int>
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(50, ErrorMessage = "Username cannot be longer than 50 characters.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    [StringLength(100, ErrorMessage = "Email cannot be longer than 100 characters.")]
    public override string Email { get; set; } = string.Empty;

    [JsonIgnore] // Исключаем навигационное свойство из сериализации
    public virtual ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
}