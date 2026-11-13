using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Promociones")]
    public class Promocion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idPromocion")]
        public int IdPromocion { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("descripcion", TypeName = "varchar(200)")]
        public string Descripcion { get; set; } = string.Empty;

        [Column("porcentajeDescuento", TypeName = "decimal(5,2)")]
        public decimal PorcentajeDescuento { get; set; }

        [Column("fechaDesde", TypeName = "date")]
        public DateTime FechaDesde { get; set; }

        [Column("fechaHasta", TypeName = "date")]
        public DateTime FechaHasta { get; set; }

        public virtual ICollection<PromocionDia> PromocionesDias { get; set; }
            = new List<PromocionDia>();

        public virtual ICollection<PromocionHorario> PromocionesHorarios { get; set; }
            = new List<PromocionHorario>();

        public virtual ICollection<DetalleReserva> DetallesReservas { get; set; }
            = new List<DetalleReserva>();

        public virtual ICollection<DetalleFactura> DetallesFacturas { get; set; }
            = new List<DetalleFactura>();
    }
}
