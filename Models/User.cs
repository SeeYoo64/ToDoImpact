using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace ToDoImpact.Models
{
    public class User : IdentityUser<int>
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        [StringLength(50, ErrorMessage = "Username cannot be longer than 50 characters.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [StringLength(100, ErrorMessage = "Email cannot be longer than 100 characters.")]
        public override string Email { get; set; } = string.Empty;

        [JsonIgnore] // ��������� ������������� �������� �� ������������
        public virtual ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();

        public List<string> Achievements { get; set; } = new List<string>();
        public int Currency { get; set; } = 0;
        public List<DateTime> TasksCompleted { get; set; } = new List<DateTime>();
    }
}