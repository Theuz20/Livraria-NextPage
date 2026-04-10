using System.ComponentModel.DataAnnotations.Schema;

namespace LivrariaPIM.Models
{
    [Table("Pagamento")]
    public class Pagamento
    {
        public int Id { get; set; }

        public int PedidoId { get; set; }
        public Pedido? Pedido { get; set; }

        public string Tipo { get; set; }

        public decimal Valor { get; set; }

        public string Status { get; set; }
    }
}
