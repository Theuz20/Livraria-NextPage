using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using LivrariaPIM.Models;

namespace LivrariaPIM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemPedidoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ItemPedidoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.ItemPedidos.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = _context.ItemPedidos.Find(id);

            if (item == null)
                return NotFound(new { mensagem = "Item do pedido não encontrado." });

            return Ok(item);
        }

        [HttpPost]
        public IActionResult Post(ItemPedido item)
        {
            var pedidoExiste = _context.Pedidos.Any(p => p.Id == item.PedidoId);
            var livro = _context.Livros.Find(item.LivroId);

            if (!pedidoExiste)
                return NotFound(new { mensagem = "Pedido não encontrado." });

            if (livro == null)
                return NotFound(new { mensagem = "Livro não encontrado." });

            if (livro.Estoque < item.Quantidade)
                return BadRequest(new { mensagem = "Estoque insuficiente." });

            item.PrecoUnitario = livro.Preco;

            livro.Estoque -= item.Quantidade;

            _context.ItemPedidos.Add(item);
            _context.SaveChanges();

            return Ok(item);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, ItemPedido item)
        {
            var itemExistente = _context.ItemPedidos.Find(id);

            if (itemExistente == null)
                return NotFound(new { mensagem = "Item do pedido não encontrado." });

            var livro = _context.Livros.Find(item.LivroId);

            if (livro == null)
                return NotFound(new { mensagem = "Livro não encontrado." });

            itemExistente.LivroId = item.LivroId;
            itemExistente.Quantidade = item.Quantidade;
            itemExistente.PrecoUnitario = livro.Preco;

            _context.SaveChanges();

            return Ok(itemExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.ItemPedidos.Find(id);

            if (item == null)
                return NotFound(new { mensagem = "Item do pedido não encontrado." });

            var livro = _context.Livros.Find(item.LivroId);

            if (livro != null)
            {
                livro.Estoque += item.Quantidade;
            }

            _context.ItemPedidos.Remove(item);
            _context.SaveChanges();

            return NoContent();
        }
    }
}