using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Facturas")]
    public class Factura
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idFactura")]
        public int IdFactura { get; set; }

        [Column("fechaHoraEmision", TypeName = "datetime")]
        public DateTime FechaHoraEmision { get; set; }

        [Column("idReserva")]
        public int? IdReserva { get; set; }

        [Column("idCliente")]
        public int IdCliente { get; set; }

        [Column("idFormaPago")]
        public int IdFormaPago { get; set; }

        [Column("idCanalVenta")]
        public int IdCanalVenta { get; set; }

        [ForeignKey(nameof(IdReserva))]
        [JsonIgnore]
        public virtual Reserva? Reserva { get; set; }

        [ForeignKey(nameof(IdCliente))]
        [JsonIgnore]
        public virtual Cliente? Cliente { get; set; }

        [ForeignKey(nameof(IdFormaPago))]
        [JsonIgnore]
        public virtual FormaPago? FormaPago { get; set; }

        [ForeignKey(nameof(IdCanalVenta))]
        [JsonIgnore]
        public virtual CanalVenta? CanalVenta { get; set; }

        public virtual ICollection<DetalleFactura> DetallesFacturas { get; set; }
            = new List<DetalleFactura>();
    }
}
