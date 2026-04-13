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
                return NotFound();

            generoExistente.Nome = genero.Nome;

            _context.SaveChanges();

            return Ok(generoExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var genero = _context.Generos.Find(id);

            if (genero == null)
                return NotFound();

            _context.Generos.Remove(genero);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
