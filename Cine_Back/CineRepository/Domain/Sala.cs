using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Salas")]
    public class Sala
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idSala")]
        public int IdSala { get; set; }

        [Column("numeroSala")]
        public int NumeroSala { get; set; }

        [Column("capacidad")]
        public int Capacidad { get; set; }

        [Column("idTipoSala")]
        public int IdTipoSala { get; set; }

        [ForeignKey(nameof(IdTipoSala))]
        [JsonIgnore]
        public virtual TipoSala? TipoSala { get; set; }

        public virtual ICollection<Butaca> Butacas { get; set; } = new List<Butaca>();

        public virtual ICollection<Funcion> Funciones { get; set; } = new List<Funcion>();
    }
}
