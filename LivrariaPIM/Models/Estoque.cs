using System.ComponentModel.DataAnnotations.Schema;

namespace LivrariaPIM.Models
{
    [Table("Estoque")]
    public class Estoque
    {
        public int Id { get; set; }

        public int LivroId { get; set; }
        public Livro? Livro { get; set; }

        public string TipoMovimentacao { get; set; }

        public int Quantidade { get; set; }

        public DateTime DataMovimentacao { get; set; }
    }
}
