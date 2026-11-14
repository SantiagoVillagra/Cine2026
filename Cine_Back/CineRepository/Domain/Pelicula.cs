using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Peliculas")]
    public class Pelicula
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idPelicula")]
        public int IdPelicula { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("titulo", TypeName = "varchar(200)")]
        public string Titulo { get; set; } = string.Empty;

        [Column("duracion")]
        public int Duracion { get; set; }

        [Column("idClasificacion")]
        public int IdClasificacion { get; set; }

        [Column("idDirector")]
        public int IdDirector { get; set; }

        [Column("fechaEstreno", TypeName = "date")]
        public DateTime FechaEstreno { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("poster", TypeName = "varchar(100)")]
        public string Poster { get; set; } = string.Empty;

        [Column("sinopsis", TypeName = "varchar(MAX)")]
        public string? Sinopsis { get; set; }

        [Required]
        [Column("activa", TypeName = "bit")]
        public bool Activa { get; set; } = true;

        [ForeignKey(nameof(IdClasificacion))]
        [JsonIgnore]
        public virtual Clasificacion? Clasificacion { get; set; }

        [ForeignKey(nameof(IdDirector))]
        [JsonIgnore]
        public virtual Director? Director { get; set; }

        public virtual ICollection<PeliculaGenero> PeliculasGeneros { get; set; }
            = new List<PeliculaGenero>();

        public virtual ICollection<ActorPelicula> ActoresPeliculas { get; set; }
            = new List<ActorPelicula>();

        public virtual ICollection<Funcion> Funciones { get; set; }
            = new List<Funcion>();
    }
}
