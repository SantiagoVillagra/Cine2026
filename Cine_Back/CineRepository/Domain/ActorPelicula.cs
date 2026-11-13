using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("ActoresPeliculas")]
    public class ActorPelicula
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idActorPelicula")]
        public int IdActorPelicula { get; set; }

        [Column("idActor")]
        public int IdActor { get; set; }

        [Column("idPelicula")]
        public int IdPelicula { get; set; }

        [ForeignKey(nameof(IdActor))]
        [JsonIgnore]
        public virtual Actor? Actor { get; set; }

        [ForeignKey(nameof(IdPelicula))]
        [JsonIgnore]
        public virtual Pelicula? Pelicula { get; set; }
    }
}
