using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("DetallesFacturas")]
    public class DetalleFactura
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idDetalleFactura")]
        public int IdDetalleFactura { get; set; }

        [Column("precioUnitario", TypeName = "decimal(10,2)")]
        public decimal PrecioUnitario { get; set; }

        [Column("idFactura")]
        public int IdFactura { get; set; }

        [Column("idFuncion")]
        public int IdFuncion { get; set; }

        [Column("idPromocion")]
        public int? IdPromocion { get; set; }

        [Column("idButaca")]
        public int IdButaca { get; set; }

        [Column("idDetalleReserva")]
        public int? IdDetalleReserva { get; set; }

        [Column("idTipoEntrada")]
        public int IdTipoEntrada { get; set; }

        [ForeignKey(nameof(IdFactura))]
        [JsonIgnore]
        public virtual Factura? Factura { get; set; }

        [ForeignKey(nameof(IdFuncion))]
        [JsonIgnore]
        public virtual Funcion? Funcion { get; set; }

        [ForeignKey(nameof(IdPromocion))]
        [JsonIgnore]
        public virtual Promocion? Promocion { get; set; }

        [ForeignKey(nameof(IdButaca))]
        [JsonIgnore]
        public virtual Butaca? Butaca { get; set; }

        [ForeignKey(nameof(IdDetalleReserva))]
        [JsonIgnore]
        public virtual DetalleReserva? DetalleReserva { get; set; }

        [ForeignKey(nameof(IdTipoEntrada))]
        [JsonIgnore]
        public virtual TipoEntrada? TipoEntrada { get; set; }
    }
}
