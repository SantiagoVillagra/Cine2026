using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Generos")]
    public class Genero
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idGenero")]
        public int IdGenero { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("nombre", TypeName = "varchar(50)")]
        public string Nombre { get; set; } = string.Empty;

        public virtual ICollection<PeliculaGenero> PeliculasGeneros { get; set; }
            = new List<PeliculaGenero>();
    }
}
