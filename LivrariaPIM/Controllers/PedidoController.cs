using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using LivrariaPIM.Models;
using Microsoft.AspNetCore.Authorization;

namespace LivrariaPIM.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PedidoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidoController(AppDbContext context)
        {
            _context = context;
        }

        // GET TODOS
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Pedidos.ToList());
        }

        // GET POR ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var pedido = _context.Pedidos.Find(id);

            if (pedido == null)
                return NotFound(new { mensagem = "Pedido não encontrado." });

            return Ok(pedido);
        }

        // POST
        [HttpPost]
        public IActionResult Post(Pedido pedido)
        {
            var clienteExiste = _context.Clientes.Any(c => c.Id == pedido.ClienteId);
            var funcionarioExiste = _context.Funcionarios.Any(f => f.Id == pedido.FuncionarioId);

            if (!clienteExiste)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            if (!funcionarioExiste)
                return NotFound(new { mensagem = "Funcionário não encontrado." });

            _context.Pedidos.Add(pedido);
            _context.SaveChanges();

            return Ok(pedido);
        }

        // PUT
        [HttpPut("{id}")]
        public IActionResult Put(int id, Pedido pedido)
        {
            var pedidoExistente = _context.Pedidos.Find(id);

            if (pedidoExistente == null)
                return NotFound(new { mensagem = "Pedido não encontrado." });

            var clienteExiste = _context.Clientes.Any(c => c.Id == pedido.ClienteId);
            var funcionarioExiste = _context.Funcionarios.Any(f => f.Id == pedido.FuncionarioId);

            if (!clienteExiste)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            if (!funcionarioExiste)
                return NotFound(new { mensagem = "Funcionário não encontrado." });

            pedidoExistente.ClienteId = pedido.ClienteId;
            pedidoExistente.FuncionarioId = pedido.FuncionarioId;

            _context.SaveChanges();

            return Ok(pedidoExistente);
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var possuiItens = _context.ItemPedidos.Any(i => i.PedidoId == id);
            var possuiPagamento = _context.Pagamentos.Any(p => p.PedidoId == id);

            if (possuiItens || possuiPagamento)
            {
                return BadRequest(new
                {
                    mensagem = "Não é possível excluir um pedido com itens ou pagamentos vinculados."
                });
            }
            var pedido = _context.Pedidos.Find(id);

            if (pedido == null)
                return NotFound(new { mensagem = "Pedido não encontrado." });

            _context.Pedidos.Remove(pedido);
            _context.SaveChanges();

            return NoContent();


        }

    }
}