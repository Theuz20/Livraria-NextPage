using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using LivrariaPIM.Models;

namespace LivrariaPIM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeneroController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GeneroController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Generos.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var genero = _context.Generos.Find(id);

            if (genero == null)
                return NotFound(new { mensagem = "Gênero não encontrado." });

            return Ok(genero);
        }

        [HttpPost]
        public IActionResult Post(Genero genero)
        {
            _context.Generos.Add(genero);
            _context.SaveChanges();

            return Ok(genero);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Genero genero)
        {
            var generoExistente = _context.Generos.Find(id);

            if (generoExistente == null)
                return NotFound(new { mensagem = "Gênero não encontrado." });

            generoExistente.Nome = genero.Nome;

            _context.SaveChanges();

            return Ok(generoExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var genero = _context.Generos.Find(id);

            if (genero == null)
                return NotFound(new { mensagem = "Gênero não encontrado." });

            var possuiLivros = _context.Livros.Any(l => l.GeneroId == id);

            if (possuiLivros)
                return BadRequest(new { mensagem = "Não é possível excluir o gênero, pois existem livros vinculados a ele." });

            _context.Generos.Remove(genero);
            _context.SaveChanges();

            return NoContent();
        }
    }
}