using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Directores")]
    public class Director
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idDirector")]
        public int IdDirector { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre", TypeName = "varchar(100)")]
        public string Nombre { get; set; } = string.Empty;

        public virtual ICollection<Pelicula> Peliculas { get; set; } = new List<Pelicula>();
    }
}
