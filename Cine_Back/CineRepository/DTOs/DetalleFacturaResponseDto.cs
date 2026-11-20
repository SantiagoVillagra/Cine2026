using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
    public class DetalleFacturaResponseDto
    {
        public int IdDetalleFactura { get; set; }
        public decimal PrecioUnitario { get; set; }
        public int IdFactura { get; set; }
        public int IdFuncion { get; set; }
        public int? IdPromocion { get; set; }
        public int IdButaca { get; set; }
        public string Fila { get; set; } = string.Empty;
        public int NumeroButaca { get; set; }
        public int? IdDetalleReserva { get; set; }
        public int IdTipoEntrada { get; set; }

        public string Pelicula { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
    }
}
