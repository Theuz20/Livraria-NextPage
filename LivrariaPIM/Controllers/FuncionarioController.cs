using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using LivrariaPIM.Models;
using LivrariaPIM.Utils;

namespace LivrariaPIM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FuncionarioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FuncionarioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Funcionarios.ToList());
        }

        [HttpPost]
        public IActionResult Post(Funcionario funcionario)
        {

            funcionario.SenhaHash = HashHelper.GerarHash(funcionario.SenhaHash);

            _context.Funcionarios.Add(funcionario);
            _context.SaveChanges();
            return Ok(funcionario);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Funcionario funcionario)
        {
            var funcExistente = _context.Funcionarios.Find(id);

            if (funcExistente == null)
                return NotFound();

            funcExistente.Nome = funcionario.Nome;
            funcExistente.Email = funcionario.Email;
            funcExistente.SenhaHash = funcionario.SenhaHash;
            funcExistente.Cargo = funcionario.Cargo;
            funcExistente.Ativo = funcionario.Ativo;

            _context.SaveChanges();

            return Ok(funcExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var func = _context.Funcionarios.Find(id);

            if (func == null)
                return NotFound();

            _context.Funcionarios.Remove(func);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
