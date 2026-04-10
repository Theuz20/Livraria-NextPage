using System.ComponentModel.DataAnnotations.Schema;

namespace LivrariaPIM.Models
{
    [Table("ItemPedido")]
    public class ItemPedido
    {
        public int Id { get; set; }

        public int PedidoId { get; set; }
        public Pedido? Pedido { get; set; }

        public int LivroId { get; set; }
        public Livro? Livro { get; set; }

        public int Quantidade { get; set; }

        public decimal PrecoUnitario { get; set; }
    }
}
