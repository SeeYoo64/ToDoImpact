using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using ToDoImpact.Models;
using ToDoImpact.Dtos;

namespace ToDoImpact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Ограничение доступа только для авторизованных пользователей
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTask>>> GetTasks()
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized("User ID claim is not a valid integer.");

            return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoTask>> GetTask(int id)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized("User ID claim is not a valid integer.");

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null) return NotFound();

            return task;
        }

        [HttpPost]
        public async Task<ActionResult<TodoTask>> CreateTask(CreateTaskDto dto)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized("User ID claim is not a valid integer.");

            var task = new TodoTask
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            Console.WriteLine($"✅ Создана задача с ID {task.Id} для пользователя {userId}");

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto dto)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized("User ID claim is not a valid integer.");

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.IsCompleted = dto.IsCompleted;

            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized("User ID claim is not a valid integer.");

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteTask(int id)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized("User ID claim is not a valid integer.");

            try
            {
                var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
                if (task == null)
                    return NotFound("Задача не найдена");

                if (task.IsCompleted)
                    return BadRequest("Задача уже выполнена");

                // Проверяем, сколько задач выполнено сегодня
                var today = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, DateTime.UtcNow.Day);
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound("Пользователь не найден");

                var tasksCompletedToday = user.TasksCompleted.Count(date => date.Date == today);
                if (tasksCompletedToday >= 3)
                    return BadRequest("Вы уже выполнили максимальное количество задач за день");

                // Обновляем задачу
                task.IsCompleted = true;
                task.CompletedAt = DateTime.UtcNow;
                task.IsArchived = true;
                _context.Entry(task).State = EntityState.Modified;

                // Обновляем пользователя
                user.TasksCompleted.Add(DateTime.UtcNow);
                user.Currency += 20; // Награда за выполнение задачи

                // Проверяем достижения
                var totalTasksCompleted = user.TasksCompleted.Count;
                var achievementMessage = $"Выполнено {totalTasksCompleted} задач";
                if (!user.Achievements.Contains(achievementMessage))
                {
                    user.Achievements.Add(achievementMessage);
                    user.Currency += 5; // Награда за достижение
                }

                await _context.SaveChangesAsync();

                return Ok(new { Message = "Задача выполнена и архивирована", Task = task });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при выполнении задачи: {ex.Message}");
                return StatusCode(500, $"Ошибка сервера: {ex.Message}");
            }
        }

        private bool TryGetUserId(out int userId)
        {
            userId = 0;
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier && int.TryParse(c.Value, out _))?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out userId))
            {
                Console.WriteLine($"❌ Ошибка: Неверный UserId в токене ({userIdClaim})");
                return false;
            }
            return true;
        }
    }
}