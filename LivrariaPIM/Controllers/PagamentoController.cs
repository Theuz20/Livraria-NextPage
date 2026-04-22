using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using LivrariaPIM.Models;

namespace LivrariaPIM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagamentoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PagamentoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Pagamentos.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var pagamento = _context.Pagamentos.Find(id);

            if (pagamento == null)
                return NotFound(new { mensagem = "Pagamento não encontrado." });

            return Ok(pagamento);
        }

        [HttpPost]
        public IActionResult Post(Pagamento pagamento)
        {
            var pedidoExiste = _context.Pedidos.Any(p => p.Id == pagamento.PedidoId);

            if (!pedidoExiste)
                return NotFound(new { mensagem = "Pedido não encontrado." });

            _context.Pagamentos.Add(pagamento);
            _context.SaveChanges();

            return Ok(pagamento);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Pagamento pagamento)
        {
            var pagamentoExistente = _context.Pagamentos.Find(id);

            if (pagamentoExistente == null)
                return NotFound(new { mensagem = "Pagamento não encontrado." });

            var pedidoExiste = _context.Pedidos.Any(p => p.Id == pagamento.PedidoId);

            if (!pedidoExiste)
                return NotFound(new { mensagem = "Pedido não encontrado." });

            pagamentoExistente.PedidoId = pagamento.PedidoId;
            pagamentoExistente.Tipo = pagamento.Tipo;
            pagamentoExistente.Valor = pagamento.Valor;
            pagamentoExistente.Status = pagamento.Status;

            _context.SaveChanges();

            return Ok(pagamentoExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var pagamento = _context.Pagamentos.Find(id);

            if (pagamento == null)
                return NotFound(new { mensagem = "Pagamento não encontrado." });

            _context.Pagamentos.Remove(pagamento);
            _context.SaveChanges();

            return NoContent();
        }
    }
}