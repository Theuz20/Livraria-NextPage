using System.ComponentModel.DataAnnotations.Schema;

namespace LivrariaPIM.Models
{
    [Table("Livro")]
    public class Livro
    {
        public int Id { get; set; }

        public string Titulo { get; set; }

        public string Autor { get; set; }

        public decimal Preco { get; set; }

        public int Estoque { get; set; }

        public int GeneroId { get; set; }
        public Genero? Genero { get; set; }
    }
}