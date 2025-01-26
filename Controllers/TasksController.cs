﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoImpact.Models;

namespace ToDoImpact.Controllers;

[ApiController]
[Route("api/[controller]")]
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
        return await _context.Tasks.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoTask>> GetTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();
        return task;
    }

    [HttpPost]
    public async Task<ActionResult<TodoTask>> CreateTask(TodoTask task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TodoTask task)
    {
        if (id != task.Id) return BadRequest();
        _context.Entry(task).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();
        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}