using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
    public class PostFacturaDto
    {
        public int IdCliente { get; set; }
        public int IdFormaPago { get; set; }
        public int IdCanalVenta { get; set; }
        public List<PostReservaDto> Detalles { get; set; }
    }
}
