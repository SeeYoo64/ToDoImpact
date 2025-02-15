using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using ToDoImpact.Models;

namespace ToDoImpact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Ограничение доступа только для авторизованных пользователей
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        // GET: api/Users/achievements
        [HttpGet("achievements")]
        public async Task<IActionResult> GetAchievements()
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized("User ID claim is not a valid integer.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("Пользователь не найден");

            return Ok(user.Achievements);
        }

        // GET: api/Users/currency
        [HttpGet("currency")]
        public async Task<IActionResult> GetCurrency()
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized("User ID claim is not a valid integer.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("Пользователь не найден");

            return Ok(user.Currency);
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