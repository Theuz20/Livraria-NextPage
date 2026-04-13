using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using LivrariaPIM.Models;
using LivrariaPIM.Utils;

namespace LivrariaPIM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClienteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Clientes.ToList());
        }

        [HttpPost]
        public IActionResult Post(Cliente cliente)
        {

            cliente.SenhaHash = HashHelper.GerarHash(cliente.SenhaHash);

            _context.Clientes.Add(cliente);            
            _context.SaveChanges();

            return Ok(cliente);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Cliente cliente)
        {
            var clienteExistente = _context.Clientes.Find(id);

            if (clienteExistente == null)
                return NotFound();

            clienteExistente.Nome = cliente.Nome;
            clienteExistente.Email = cliente.Email;
            clienteExistente.SenhaHash = cliente.SenhaHash;
            clienteExistente.Ativo = cliente.Ativo;

            _context.SaveChanges();

            return Ok(clienteExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var cliente = _context.Clientes.Find(id);

            if (cliente == null)
                return NotFound();

            _context.Clientes.Remove(cliente);
            _context.SaveChanges();

            return NoContent();
        }

    }
}
