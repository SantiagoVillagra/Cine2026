using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Actores")]
    public class Actor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idActor")]
        public int IdActor { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre", TypeName = "varchar(100)")]
        public string Nombre { get; set; } = string.Empty;

        public virtual ICollection<ActorPelicula> ActoresPeliculas { get; set; }
            = new List<ActorPelicula>();
    }
}
