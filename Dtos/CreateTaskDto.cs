using System.ComponentModel.DataAnnotations;

namespace ToDoImpact.Dtos;
public class CreateTaskDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, ErrorMessage = "Title cannot be longer than 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "UserId is required.")]
    public int UserId { get; set; }
}