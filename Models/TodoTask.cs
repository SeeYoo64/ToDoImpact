﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ToDoImpact.Models;
public class TodoTask
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, ErrorMessage = "Title cannot be longer than 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
    public string Description { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }

    // Внешний ключ для связи с пользователем
    [Required(ErrorMessage = "UserId is required.")]
    public int UserId { get; set; }

    [JsonIgnore] // Исключаем навигационное свойство из сериализации
    public User User { get; set; } = new User();
}