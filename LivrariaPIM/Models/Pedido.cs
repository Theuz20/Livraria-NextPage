using System.ComponentModel.DataAnnotations.Schema;

namespace LivrariaPIM.Models
{
    [Table("Pedido")]
    public class Pedido
    {
        public int Id { get; set; }

        public DateTime Data { get; set; } = DateTime.Now;

        public string Status { get; set; } = "Pendente";

        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public int FuncionarioId { get; set; }
        public Funcionario? Funcionario { get; set; }

        public List<ItemPedido>? Itens { get; set; }
    }
}
