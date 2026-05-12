using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using Microsoft.AspNetCore.Authorization;

namespace LivrariaPIM.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var totalLivros = _context.Livros.Count();

            var totalClientes = _context.Clientes.Count();

            var totalPedidos = _context.Pedidos.Count();

            var totalPagamentos = _context.Pagamentos.Sum(p => p.Valor);

            var livrosSemEstoque = _context.Livros
                .Count(l => l.Estoque == 0);

            return Ok(new
            {
                totalLivros,
                totalClientes,
                totalPedidos,
                totalPagamentos,
                livrosSemEstoque
            });
        }
    }
}