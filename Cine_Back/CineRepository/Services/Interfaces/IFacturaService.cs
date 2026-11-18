using CineRepository.Domain;
using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Services.Interfaces
{
    public interface IFacturaService
    {
        Task<Factura?> CrearVentaDirectaAsync(PostFacturaDto factura);
        Task<Factura?> CrearVentaPorReservaAsync(Factura factura);
        Task<Factura?> TraerPorIdAsync(int idFactura, int idCliente, bool esAdmin);
    }
}
