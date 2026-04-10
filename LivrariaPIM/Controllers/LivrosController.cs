using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using LivrariaPIM.Models;
using Microsoft.EntityFrameworkCore;

namespace LivrariaPIM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LivrosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LivrosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var livros = await _context.Livros.Include(l => l.Genero).ToListAsync();
            return Ok(livros);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Livro livro)
        {
            _context.Livros.Add(livro);
            await _context.SaveChangesAsync();
            return Ok(livro);
        }
    }
}