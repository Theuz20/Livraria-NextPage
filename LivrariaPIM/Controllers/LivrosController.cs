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
            var livros = await _context.Livros
                .Include(l => l.Genero)
                .ToListAsync();

            return Ok(livros);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var livro = await _context.Livros
                .Include(l => l.Genero)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (livro == null)
                return NotFound(new { mensagem = "Livro não encontrado." });

            return Ok(livro);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Livro livro)
        {
            if (!_context.Generos.Any(g => g.Id == livro.GeneroId))
                return NotFound(new { mensagem = "Gênero não encontrado." });

            _context.Livros.Add(livro);
            await _context.SaveChangesAsync();

            return Ok(livro);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Livro livro)
        {
            var livroExistente = _context.Livros.Find(id);

            if (livroExistente == null)
                return NotFound(new { mensagem = "Livro não encontrado." });

            if (!_context.Generos.Any(g => g.Id == livro.GeneroId))
                return NotFound(new { mensagem = "Gênero não encontrado." });

            livroExistente.Titulo = livro.Titulo;
            livroExistente.Autor = livro.Autor;
            livroExistente.Preco = livro.Preco;
            livroExistente.Estoque = livro.Estoque;
            livroExistente.GeneroId = livro.GeneroId;

            _context.SaveChanges();

            return Ok(livroExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var livro = _context.Livros.Find(id);

            if (livro == null)
                return NotFound(new { mensagem = "Livro não encontrado." });

            _context.Livros.Remove(livro);
            _context.SaveChanges();

            return NoContent();
        }
    }
}