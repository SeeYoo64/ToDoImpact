using System.Text.Json.Serialization;

namespace ToDoImpact.Models;

public class TodoTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }

    // Внешний ключ для связи с пользователем
    public int UserId { get; set; }

    [JsonIgnore] // Исключаем навигационное свойство из сериализации
    public User User { get; set; } = new User();
}