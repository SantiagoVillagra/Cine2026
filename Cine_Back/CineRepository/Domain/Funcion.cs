using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Funciones")]
    public class Funcion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idFuncion")]
        public int IdFuncion { get; set; }

        [Column("fecha", TypeName = "date")]
        public DateTime Fecha { get; set; }

        [Column("idHoraFuncion")]
        public int IdHoraFuncion { get; set; }

        [Column("subtitulada")]
        public bool Subtitulada { get; set; }

        [Column("idPelicula")]
        public int IdPelicula { get; set; }

        [Column("idSala")]
        public int IdSala { get; set; }

        [Column("idIdioma")]
        public int IdIdioma { get; set; }

        [ForeignKey(nameof(IdHoraFuncion))]
        [JsonIgnore]
        public virtual HorasFuncion? HorasFuncion { get; set; }

        [ForeignKey(nameof(IdPelicula))]
        [JsonIgnore]
        public virtual Pelicula? Pelicula { get; set; }

        [ForeignKey(nameof(IdSala))]
        [JsonIgnore]
        public virtual Sala? Sala { get; set; }

        [ForeignKey(nameof(IdIdioma))]
        [JsonIgnore]
        public virtual Idioma? Idioma { get; set; }

        public virtual ICollection<DetalleReserva> DetallesReservas { get; set; }
            = new List<DetalleReserva>();

        public virtual ICollection<DetalleFactura> DetallesFacturas { get; set; }
            = new List<DetalleFactura>();
    }
}
