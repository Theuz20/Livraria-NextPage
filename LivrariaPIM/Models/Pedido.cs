using System.ComponentModel.DataAnnotations.Schema;

namespace LivrariaPIM.Models
{
    [Table("Pedido")]
    public class Pedido
    {
        public int Id { get; set; }

        public DateTime Data { get; set; }

        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public List<ItemPedido>? Itens { get; set; }
        public int FuncionarioId { get; set; }
        public Funcionario? Funcionario { get; set; }
    }
}
