using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("PeliculasGeneros")]
    public class PeliculaGenero
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idPeliculaGenero")]
        public int IdPeliculaGenero { get; set; }

        [Column("idPelicula")]
        public int IdPelicula { get; set; }

        [Column("idGenero")]
        public int IdGenero { get; set; }

        [ForeignKey(nameof(IdPelicula))]
        [JsonIgnore]
        public virtual Pelicula? Pelicula { get; set; }

        [ForeignKey(nameof(IdGenero))]
        [JsonIgnore]
        public virtual Genero? Genero { get; set; }
    }
}
