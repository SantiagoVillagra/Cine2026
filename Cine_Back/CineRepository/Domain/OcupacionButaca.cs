
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("OcupacionesButacas")]
    public class OcupacionButaca
    {
        [Key]
        [Column(Order = 0)]
        public int IdFuncion { get; set; }

        [Key]
        [Column(Order = 1)]
        public int IdButaca { get; set; }

        [Column("idDetalleReserva")]
        public int? IdDetalleReserva { get; set; }

        [Column("idDetalleFactura")]
        public int? IdDetalleFactura { get; set; }

        
        [ForeignKey(nameof(IdFuncion))]
        [JsonIgnore]
        public virtual Funcion Funcion { get; set; }

        
        [ForeignKey(nameof(IdButaca))]
        [JsonIgnore]
        public virtual Butaca Butaca { get; set; }

        
        [ForeignKey(nameof(IdDetalleReserva))]
        public virtual DetalleReserva? DetalleReserva { get; set; }

        
        [ForeignKey(nameof(IdDetalleFactura))]
        public virtual DetalleFactura? DetalleFactura { get; set; }
    }
}
