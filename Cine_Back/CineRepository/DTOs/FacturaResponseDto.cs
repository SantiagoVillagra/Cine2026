using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
    public class FacturaResponseDto
    {
        public int IdFactura { get; set; }
        public DateTime FechaHoraEmision { get; set; }
        public int? IdReserva { get; set; }
        public int IdCliente { get; set; }
        public int IdFormaPago { get; set; }
        public int IdCanalVenta { get; set; }
        public List<DetalleFacturaResponseDto> DetallesFacturas { get; set; } = new();

        public string NombreCliente { get; set; } = string.Empty;
        public decimal PrecioTotal { get; set; }
    }
}
