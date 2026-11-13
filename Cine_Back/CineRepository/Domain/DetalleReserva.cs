using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("DetallesReservas")]
    public class DetalleReserva
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idDetalleReserva")]
        public int IdDetalleReserva { get; set; }

        [Column("idReserva")]
        public int IdReserva { get; set; }

        [Column("idFuncion")]
        public int IdFuncion { get; set; }

        [Column("idButaca")]
        public int IdButaca { get; set; }

        [Column("idTipoEntrada")]
        public int IdTipoEntrada { get; set; }

        [Column("precio", TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        [Column("idPromocion")]
        public int? IdPromocion { get; set; }

        [ForeignKey(nameof(IdReserva))]
        [JsonIgnore]
        public virtual Reserva? Reserva { get; set; }

        [ForeignKey(nameof(IdFuncion))]
        [JsonIgnore]
        public virtual Funcion? Funcion { get; set; }

        [ForeignKey(nameof(IdButaca))]
        [JsonIgnore]
        public virtual Butaca? Butaca { get; set; }

        [ForeignKey(nameof(IdTipoEntrada))]
        [JsonIgnore]
        public virtual TipoEntrada? TipoEntrada { get; set; }

        [ForeignKey(nameof(IdPromocion))]
        [JsonIgnore]
        public virtual Promocion? Promocion { get; set; }

        public virtual ICollection<DetalleFactura> DetallesFacturas { get; set; }
            = new List<DetalleFactura>();
    }
}
