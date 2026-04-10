using System.ComponentModel.DataAnnotations.Schema;

namespace LivrariaPIM.Models
{
    [Table("Genero")]
    public class Genero
    {
        public int Id { get; set; }

        public string Nome { get; set; }

        public List<Livro>? Livros { get; set; }
    }
}
