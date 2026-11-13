using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Clasificaciones")]
    public class Clasificacion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idClasificacion")]
        public int IdClasificacion { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("descripcion", TypeName = "varchar(20)")]
        public string Descripcion { get; set; } = string.Empty;

        public virtual ICollection<Pelicula> Peliculas { get; set; } = new List<Pelicula>();
    }
}
