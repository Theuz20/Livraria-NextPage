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

        [HttpPost]
        public IActionResult Post(ItemPedido item)
        {
            _context.ItemPedidos.Add(item);
            _context.SaveChanges();
            return Ok(item);
        }
    }
}