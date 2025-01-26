using System.Text.Json.Serialization;

namespace ToDoImpact.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    [JsonIgnore] // Исключаем навигационное свойство из сериализации
    public List<TodoTask> Tasks { get; set; } = new List<TodoTask>();
}