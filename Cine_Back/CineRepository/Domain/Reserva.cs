using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Reservas")]
    public class Reserva
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idReserva")]
        public int IdReserva { get; set; }

        [Column("fechaHoraReserva", TypeName = "datetime")]
        public DateTime FechaHoraReserva { get; set; }

        [Column("idCliente")]
        public int IdCliente { get; set; }

        [Column("estado")]
        public bool Estado { get; set; }

        [Column("fechaHoraConfirmacion", TypeName = "datetime")]
        public DateTime? FechaHoraConfirmacion { get; set; }

        [ForeignKey(nameof(IdCliente))]
        [JsonIgnore]
        public virtual Cliente? Cliente { get; set; }

        public virtual ICollection<DetalleReserva> DetallesReservas { get; set; }
            = new List<DetalleReserva>();

        public virtual ICollection<Factura> Facturas { get; set; }
            = new List<Factura>();
    }
}
